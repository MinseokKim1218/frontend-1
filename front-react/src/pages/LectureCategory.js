import axios from 'axios';
import { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert'
import { filter } from 'lodash';

// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';

// sections
import { RegisterCategoryForm } from '../sections/lecturecategory';
import { CategoryModifyInputBox, CategoryListHead, CategoryListToolbar } from '../sections/@dashboard/lecturecategory';

// -------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'categoryId', label: '분류ID', align: 'center' },
  { id: 'categoryName', label: '분류명', align: 'left' },
  { id: 'modifybtn' },
  { id: 'deletebtn' }
];
// ------------------------------------------------------------------

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
    return filter(array, (_category) => _category.categoryName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}


export default function LectureCategory() {

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('categoryId');
  const [filterValue, setFilterValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [CATEGORYLIST, setCATEGORYLIST] = useState([]);

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

  const handleFilterByValue = (event) => {
    setFilterValue(event.target.value);
  };

  const filteredCategories = applySortFilter(CATEGORYLIST, getComparator(order, orderBy), filterValue);

  // 전체 카테고리 조회
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_CATEGORY_URL}/lectureCategories/searchAll`)
    .then(res => setCATEGORYLIST(res.data))
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
          <CategoryListToolbar filterValue={filterValue} onFilterValue={handleFilterByValue} />

          <Scrollbar>
            <TableContainer width="60%" margin="auto">
              <Table>
                <colgroup>
                  <col width="20%" />
                  <col width="50%" />
                  <col width="10%" />
                  <col width="10%" />
                </colgroup>

                <CategoryListHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={CATEGORYLIST.length}
                  headLabel={TABLE_HEAD}
                  onRequestSort={handleRequestSort}
                />

                <TableBody>
                  {filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { categoryId, categoryName } = row;

                    return (
                      <TableRow
                        hover
                        key={categoryId}
                        tabIndex={-1}
                        role="checkbox"
                      >
                        <TableCell align="center">{categoryId}</TableCell>
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
            count={CATEGORYLIST.length}
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