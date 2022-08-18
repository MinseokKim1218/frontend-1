import axios from 'axios';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import { confirmAlert } from 'react-confirm-alert';


// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Modal
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import { AuctionBidInputBox, AuctionBidSuccessBox } from '../sections/@dashboard/auctionBid';





// mock
import USERLIST from '../_mock/user';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'lectTypeNm', label: '강의분류', alignRight: false },
  { id: 'lectName', label: '강의명', alignRight: false },
  { id: 'startAuctionDate', label: '경매시작일자', alignRight: false },
  { id: 'endAuctionDate', label: '경매종료일자', alignRight: false },
  { id: 'cntStudent', label: '수강인원', alignRight: false },
  { id: 'lectCost', label: '강의료', alignRight: false },
  { id: 'auctionStatus', label: '경매상태', alignRight: false },
  { id: 'lectureBidCnt', label: '입찰수', alignRight: false },
  { id: 'bidMinPrice', label: '최저입찰가', alignRight: false },
  { id: 'bidDetailList', label: '입찰상세', alignRight: false },
  { id: 'bidSuccessBtn', label: '낙찰', alignRight: false },




  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}



export default function User() {

  const [openRegister, setOpenRegister] = useState(false);

  const handleOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };




  // 낙찰팝업 OPEN/CLOSE
  const [openBidSuccessRegister, setOpenBidSuccessRegister] = useState(false);

  const handleOpenBidSuccessRegister = () => {
    setOpenBidSuccessRegister(true);
  };

  const handleCloseBidSuccessRegister = () => {
    setOpenBidSuccessRegister(false);
  };



  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [auctionId, setAuctionId] = useState([]);

  const [clickedAuctionId, setClickedAuctionId] = useState([]);



  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [info, setInfo] = useState([])

  const [detailInfo, setDetailInfo] = useState([])


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const onBidDetailButtonClick = (state, rowInfo, column, instance) => {
    handleOpenBidSuccessRegister();
    return {
        onClick: e => {
            console.log('A Td Element was clicked!')
            console.log('it produced this event:', e)
            console.log('It was in this column:', column)
            console.log('It was in this row:', rowInfo)
            console.log('It was in this table instance:', instance)
          }
      }
  }


  const onBidSuccessButtonClick = (event, auctionId) => {

    searchBidDetailList(auctionId);

}

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);


  const confirmLectureBidCancel = () => {
    confirmAlert({
      title : '입찰취소',
      message : '입찰을 취소하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: () => {
            lectureBidCancel();
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }

  // const auctions = () => {

  //   const response = axios.get("http://localhost:8084/auctions");
  //   console.log(response.data);

  //  }


  // const headers = {};
  // const response = axios.get('http://localhost:8084/auctions', headers);
  // response = axios.get("http://localhost:8084/auctions");
  // console.log(response.data);
  // console.log(181818181818)


  // const response = await axios.get(this.BASE_URL + '/api/hello', data);
  const myMethod = () => {
    axios.put(`http://localhost:8084/auctions/1/cancel`,
    {
      withCredentials: true // 쿠키 cors 통신 설정
    }).then(response => {
      console.log(response);
    })

  }




  const lectureBidCancel = () => {
    alert(111);
    console.log(info);
    axios({
      method: 'put',
      url: 'http://localhost:8084/lectureBids/cancelBid',
      data: {
        auctionId: '1',
        memberId: 1004
      }
    })
    .catch(err => console.log(err))
  }


  const searchBidDetailList = (auctionId) => {
    axios(

      {
        url: "http://localhost:8084/lectureBids/searchLectureBidList/",
        method: "get",
        params: {"auctionId": auctionId}
      }
    )
    .then(
      res => setDetailInfo(res.data),
      // console.log(5555),
      // console.log(detailInfo),
      setClickedAuctionId(auctionId),
      handleOpenBidSuccessRegister()


    )
    .catch(err => console.log(err));

  }

  const searchAuctionList = () => {
    axios.get(`http://localhost:8084/auctions/searchAuctionLectureBidList`,{})
    .then(res => setInfo(res.data))
    .catch(err => console.log(err))
  }

  useEffect(() => {
    axios.get('http://localhost:8084/auctions/searchAuctionLectureBidList')
    .then(res => setInfo(res.data))
    .catch(err => console.log(err));
  }, [])


  const auctionBidCancel= () => {
    console.log(info);
    axios({
      method: 'put',
      url: 'http://localhost:8084/lectureBids/cancelBid',
      data: {
        memberId: 1004,
        auctionId: 1
      }
    })
    .catch(err => console.log(err))
  }

  const isUserNotFound = filteredUsers.length === 0;

  // console.log(info)


  const [modalVisible, setModalVisible] = useState(true)

  const closeModal = () => {
    setModalVisible(false)
  }



  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            경매입찰 리스트
          </Typography>

{/*
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <AuctionRegisterPopover />
          </Stack> */}
          <div>
          <AuctionBidInputBox
              isOpenRegister={openRegister}
              onOpenRegister={handleOpenRegister}
              onCloseRegister={handleCloseRegister}
              onAfterSaveAuction={searchAuctionList}
              selectedLectinfo={info}
              selectedAuctionId={selected}
            />

          <AuctionBidSuccessBox
            isOpenBidSuccessRegister={openBidSuccessRegister}
            onOpenBidSuccessRegister={handleOpenBidSuccessRegister}
            onCloseBidSuccessRegister={handleCloseBidSuccessRegister}
            onAfterSaveAuction={searchAuctionList}
            selectedLectinfo={info}
            bidDetailInfo={detailInfo}
            selectedAuctionId={clickedAuctionId}
          />


          <Button variant="contained" onClick={confirmLectureBidCancel} component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
          입찰취소
              </Button>

          </div>

        </Stack>

        <Card>
          {/* <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {info.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    // const { id, lectName, lectStatus,  startAuctionDate, endAuctionDate} = row;

                    const { auctionId, lectId, lectTypeNm, lectName, startAuctionDate,  endAuctionDate, cntStudent, lectCost, auctionStatus, lectureBidCnt, bidMinPrice} = row;


                    const isItemSelected = selected.indexOf(auctionId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={auctionId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, auctionId)} />
                        </TableCell>

                        <TableCell align="left">{lectTypeNm}</TableCell>
                        <TableCell align="left">{lectName} </TableCell>
                        <TableCell align="left">{startAuctionDate}</TableCell>
                        <TableCell align="left">{endAuctionDate}</TableCell>
                        <TableCell align="left">{cntStudent}</TableCell>
                        <TableCell align="left">{lectCost}</TableCell>
                        {/* <TableCell align="left">{auctionStatus}</TableCell> */}

                         <TableCell align="left">
                          <Label variant="ghost" color={(auctionStatus === 'banned' && 'error') || 'success'}>
                           {auctionStatus}
                          </Label>
                        </TableCell>

                        <TableCell align="left">{lectureBidCnt}</TableCell>
                        <TableCell align="left">{bidMinPrice}</TableCell>
                        <TableCell align="left"><Button onClick={() => onBidDetailButtonClick(auctionId)}>입찰상세</Button></TableCell>
                        <TableCell align="left"><Button onClick={(event) => onBidSuccessButtonClick(event, auctionId)}>낙찰하기</Button></TableCell>







                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
