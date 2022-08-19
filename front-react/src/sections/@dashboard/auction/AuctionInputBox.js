import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { confirmAlert } from 'react-confirm-alert'



// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// components
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import { ColorManyPicker } from '../../../components/color-utils';

import { RHFTextField } from '../../../components/hook-form';







// ----------------------------------------------------------------------



export const SORT_BY_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'priceDesc', label: 'Price: High-Low' },
  { value: 'priceAsc', label: 'Price: Low-High' },
];
export const FILTER_GENDER_OPTIONS = ['Men', 'Women', 'Kids'];
export const FILTER_CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const FILTER_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const FILTER_PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];
export const FILTER_COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------

AuctionInputBox.propTypes = {
  isOpenRegister: PropTypes.bool,
  onOpenRegister: PropTypes.func,
  onCloseRegister: PropTypes.func,
};



export default function AuctionInputBox({ isOpenRegister, onOpenRegister, onCloseRegister, onAfterSaveAuction, selectedLectinfo, selectedlectId}) {

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);

  // 경매등록 확인창
  const confirmPopup = () => {
    
    console.log(selectedlectId);
    onCloseRegister(); // 드로우를 닫는다.
    console.log(selectedlectId);
    console.log(selectedLectinfo);
    confirmAlert({
      title : '경매등록 확인',
      message : '경매등록을 계속 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: () => {
            auctionRegister();
          }
        },
        {
          label: '아니오',
        }
      ]
    })
  }
  // 경매등록 확인창
  const alertPopup = (inputMessage) => {
    confirmAlert({
      title : '확인',
      message : inputMessage,
      buttons: [
        {
          label: '확인',
          onClick: () => onAfterSaveAuction()

        }
      ]
    })
  }



  const auctionRegister = () => {
    console.log(selectedLectinfo);
    axios({
      method: 'put',
      url: 'http://localhost:8084/auctions/auctionRegister',
      data: {
        lectIds: selectedlectId,
        startAuctionDate: startDate,
        endAuctionDate: endDate,
      }
    })
    .then(res => alertPopup('경매등록확인'))
    .catch(err => console.log(err))
  }



  return (
    <>

      {/* <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filters&nbsp;
      </Button> */}
      <Button variant="contained" onClick={onOpenRegister} component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
            경매등록
      </Button>

      <Drawer
        anchor="right"
        open={isOpenRegister}
        onClose={onCloseRegister}
        PaperProps={{
          sx: { width: 280, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            경매등록정보 입력
          </Typography>
          <IconButton onClick={onCloseRegister}>
            <Iconify icon="eva:close-fill" width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            <div>
              <Typography variant="subtitle1" gutterBottom>
                경매시작일자
              </Typography>
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} />

            </div>

            <div>
              <Typography variant="subtitle1" gutterBottom>
                경매종료일자
              </Typography>

              <DatePicker selected={endDate} onChange={date => setEndDate(date)} />

            </div>

            <div>
              <Button variant="contained" onClick={confirmPopup} component={RouterLink} to="#" startIcon={<Iconify icon="eva:plus-fill" />}>
                  등록
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
