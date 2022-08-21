import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { confirmAlert } from 'react-confirm-alert'

// material
import {
  Box,
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  TextField
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------

CategoryModifyInputBox.propTypes = {
  modifyOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};



export default function CategoryModifyInputBox({modifyOpen, onOpen, onClose, selectedCategoryId, selectedCategoryName}) {

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleNewCategoryNameChange = (event) => {
    setNewCategoryName(event.target.value);
  };

  // 확인창
  const confirmPopup = () => {
    onClose(); // 드로우를 닫는다.

    confirmAlert({
      title : '분류명 수정 확인',
      message : '분류명을 수정하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: () => {
            requestModify();
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }

  const requestModify = () => {
    axios({
      method: 'patch',
      url: `${process.env.REACT_APP_BACK_CATEGORY_URL}/lectureCategories/modifyCategoryName`,
      data: {
        categoryId: selectedCategoryId,
        categoryName: newCategoryName
      }
    })
    .then(res =>{
      const result = res.data;
      if(result === -1) {
        alert('해당 분류명이 이미 존재합니다.');
      } else {
        alert('수정 완료되었습니다.');
        window.location.replace('/dashboard/lectureCategory');
      }
    })
    .catch(err => console.log(err));
  };


  return (
    <>
      <Drawer
        anchor="right"
        open={modifyOpen}
        onClose={onClose}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            분류명 수정
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon="eva:close-fill" width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Typography>
              기존 분류명: {selectedCategoryName}
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="TF_newCategoryName"
              label="새로운 분류명"
              type="string"
              fullWidth
              variant="standard"
              onChange={handleNewCategoryNameChange}
            />
            <div>
              <Button variant="contained" onClick={confirmPopup}>
                  수정
              </Button>

            </div>


          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="outlined"
            startIcon={<Iconify icon="ic:round-clear-all" />}
          >
            Clear All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
