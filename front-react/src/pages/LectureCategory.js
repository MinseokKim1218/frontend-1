import axios from 'axios';
import { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'

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
  TextField,
} from '@mui/material';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';

// sections
import { RegisterCategoryForm } from '../sections/lecturecategory';
import { CategoryModifyInputBox, CategoryListHead } from '../sections/@dashboard/lecturecategory';

// -------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'categoryId', label: '분류ID', alignRight: false },
  { id: 'categoryName', label: '분류명', alignRight: false },
  { id: 'modifybtn' },
  { id: 'deletebtn' }
];
// ------------------------------------------------------------------

export default function LectureCategory() {

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('categoryId');

  const [rowsPerPage, setRowsPerPage] = useState(7);

  const [info, setInfo] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxClick = (event, categoryId) => {
    const selectedIndex = selected.indexOf(categoryId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, categoryId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = info.map((n) => n.categoryId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // 전체 카테고리 조회
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_CATEGORY_URL}/lectureCategories/searchAll`)
    .then(res => setInfo(res.data))
    .catch(err => console.log(err));
  }, []);

  // ---------- modal창 관련 ------------ //
  const [modifyOpen, setModifyOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  const handleModifyOpen = (selectedCategoryId, selectedCategoryName) => {
    setModifyOpen(true);
    setSelectedCategoryId(selectedCategoryId);
    setSelectedCategoryName(selectedCategoryName);
  };
  const handleModifyClose = () => {
    setModifyOpen(false);
  };

  // 삭제 확인창
  const confirmDeletePopup = (selectedCategoryId, selectedCategoryName) => {

    confirmAlert({
      title : '분류 삭제 확인',
      message : `선택하신 분류(${selectedCategoryName})를 삭제하시겠습니까?`,
      buttons: [
        {
          label: '네',
          onClick: () => {
            requestDelete(selectedCategoryId, selectedCategoryName);
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }
  // ---------- modal 창 관련 ------------ //


  const requestDelete = (selectedCategoryId, selectedCategoryName) => {
    console.log(selectedCategoryId);
    axios({
      method: 'delete',
      url: `${process.env.REACT_APP_BACK_CATEGORY_URL}/lectureCategories/deleteCategory`,
      data: {
        categoryId: selectedCategoryId,
        categoryName: selectedCategoryName
      }
    })
    .then(res =>{
      const result = res.data;
      if(result === -1) {
        alert('해당 분류가 존재하지 않습니다.');
      } else {
        alert('삭제되었습니다.');
        window.location.replace('/dashboard/lectureCategory');
      }
    })
    .catch(err => console.log(err));
  };

  return (
    <Page title="Lecture Category">
      <Container>
        <CategoryModifyInputBox
              modifyOpen={modifyOpen}
              onOpen={handleModifyOpen}
              onClose={handleModifyClose}
              selectedCategoryId={selectedCategoryId}
              selectedCategoryName={selectedCategoryName}
            />

        <Stack direction="row">
          <Typography variant="h4" gutterBottom>
            강의 분류
          </Typography>
        </Stack>

        <RegisterCategoryForm />

        <Card style={{width: '80%', margin: 'auto'}}>
          <Scrollbar>
            <TableContainer width="60%" margin="auto">
              <Table >
                <colgroup>
                  <col width="10%" />
                  <col width="20%" />
                  <col width="50%" />
                  <col width="10%" />
                  <col width="10%" />
                </colgroup>
                <CategoryListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={info.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}

                />
                <TableBody>
                  {info.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { categoryId, categoryName } = row;
                    const isItemSelected = selected.indexOf(categoryId) !== -1;

                    return (
                      <TableRow
                        hover
                        key={categoryId}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell align="center" padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleCheckboxClick(event, categoryId)} />
                        </TableCell>
                        <TableCell align="left">{categoryId}</TableCell>
                        <TableCell align="left">{categoryName}</TableCell>
                        <TableCell >
                          <Button onClick={()=>handleModifyOpen(categoryId, categoryName)}>수정</Button>
                        </TableCell>
                        <TableCell >
                          <Button onClick={()=>confirmDeletePopup(categoryId, categoryName)}>삭제</Button>
                        </TableCell>

                      </TableRow>
                    );
                  })}
                </TableBody>

              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[7, 10]}
            component="div"
            count={info.length}
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