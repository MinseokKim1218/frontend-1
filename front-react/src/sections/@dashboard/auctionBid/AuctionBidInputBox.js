import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


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
  TextField,
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

AuctionBidInputBox.propTypes = {
  isOpenRegister: PropTypes.bool,
  onOpenRegister: PropTypes.func,
  onCloseRegister: PropTypes.func,
};



export default function AuctionBidInputBox({ isOpenRegister, onOpenRegister, onCloseRegister, onAfterSaveAuction, selectedLectinfo, selectedAuctionId }) {

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [bidPrice, setBidPrice] = useState(0);

  const bidRegisterOpen = () => {

    console.log(131313);;
    console.log(selectedLectinfo);
    console.log(selectedAuctionId);
    for(let i=0; i<selectedAuctionId.length; i+=1){
      console.log(i);
      for(let j = 0; j<selectedLectinfo.length; j+=1){
        console.log(j);
        if(selectedAuctionId[i] === selectedLectinfo[j].auctionId){
            console.log(selectedLectinfo[j].auctionStatus);
          if(selectedLectinfo[j].auctionStatus==='BID_SUCCESS'){
            alertPopup('경매 낙찰이 완료된 건은 입찰할 수가 없습니다.');
            return;
          }
          if(selectedLectinfo[j].auctionStatus==='AFTER_AUCTION'){
            alertPopup('종료된 경매는 입찰할 수가 없습니다.');

            return;
          }
          if(selectedLectinfo[j].auctionStatus==='BEFORE_AUCTION'){
            alertPopup('시작되지 않은 경매는 입찰할 수가 없습니다.');

            return;
          }
        }
      }
    }
    onOpenRegister();

  }

  const confirmPopup = () => {


    onCloseRegister();
    confirmAlert({
      title : '입찰확인',
      message : '입찰을 계속 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: () => {
            auctionBidRegister();
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
    if(inputMessage==='CANCEL'){
      inputMessage = '취소된 경매는 입찰 할 수가 없습니다.'
    }else if(inputMessage==='BEFORE_AUCTION'){
      inputMessage = '경매가 아직 시작되지 않았습니다.'

    }else if(inputMessage==='AFTER_AUCTION'){
      inputMessage = '경매가 이미 종료 되었습니다.'

    }else if(inputMessage==='BID_SUCCESS'){
      inputMessage = '경매 낙찰이 이미 완료되었습니다.'

    }
    // else{
    //   inputMessage = '입찰이 완료되었습니다.'

    // }

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

  const auctionBidRegister = () => {
    console.log(selectedLectinfo);
    axios({
      method: 'put',
      url: 'http://localhost:8084/lectureBids/registerBid',
      data: {
        auctionIds: selectedAuctionId,
        price: bidPrice,
        memberId: 1004
      }
    })
    .then(res => alertPopup(res.data)
          
    )
       
    .catch(err => console.log(err))
  }



  const RegisterCategorySchema = Yup.object().shape({
    categoryName: Yup.string().required('CategoryName is required'),
  });



  return (
    <>

      {/* <Button disableRipple color="inherit" endIcon={<Iconify icon="ic:round-filter-list" />} onClick={onOpenFilter}>
        Filters&nbsp;
      </Button> */}
      <Button variant="contained" onClick={bidRegisterOpen} component={RouterLink} to="#" startIcon={<Iconify icon="ic:outline-edit" />}>
            입찰
      </Button>

      <Drawer
        id="auctionBidDrawer"
        anchor="right"
        open={isOpenRegister}
        onClose={onCloseRegister}
        PaperProps={{
          sx: { width: 350, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            입찰정보 입력
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
                입찰가
              </Typography>
            </div>
            <div>
              <TextField id="bidPrice" label="Outlined" variant="outlined" onChange={(event) => setBidPrice(event.target.value)}/>

              {/* <RHFTextField name="categoryName" label="분류명"/> */}

            </div>




            <div>
              <Button variant="contained" onClick={confirmPopup} component={RouterLink} to="#" startIcon={<Iconify icon="ic:outline-edit" />}>
                  입찰가 등록
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
