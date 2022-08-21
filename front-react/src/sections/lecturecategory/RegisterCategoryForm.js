import axios from 'axios';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function RegisterCategoryForm() {

  const navigate = useNavigate();

  const RegisterCategorySchema = Yup.object().shape({
    categoryName: Yup.string().required('CategoryName is required'),
  });

  const defaultValues = {
    categoryName: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(RegisterCategorySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    // console.log(methods.getValues().categoryName);
    axios.post(`${process.env.REACT_APP_BACK_CATEGORY_URL}/lectureCategories/registerCategory`, {
      categoryName: methods.getValues().categoryName
    })
    .then(res => {
      const result = res.data;
      // console.log(result);
      if(result === -1) {
        alert('해당 분류가 이미 존재합니다.');
      } else {
        alert('등록되었습니다.');
        window.location.replace('/dashboard/lectureCategory');
      }
    })
    .catch(err => console.log(err));
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} width="50%" margin="auto" marginTop="30px" marginBottom="30px">
        <RHFTextField name="categoryName" label="분류명"/>
        <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting} >
            강의분류 등록
        </LoadingButton>
      </Stack>

    </FormProvider>
  );
}
