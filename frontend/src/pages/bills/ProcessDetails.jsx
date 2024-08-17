import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { GetProcessBillByIdAsync } from '../../features/ProcessBillSlice';

const ProcessDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();


    const { loading, ProcessBillsDetails } = useSelector((state) => state.ProcessBill);
    console.log('ProcessBillsDetails', ProcessBillsDetails);

    useEffect(() => {
        if (id) {
            dispatch(GetProcessBillByIdAsync({ id }));
        }
    }, [dispatch, id]);



    return (
        <>
            <section className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 mt-7 mb-0 mx-6 px-5 py-6 min-h-[70vh] rounded-lg'>

            </section>
        </>
    )
}

export default ProcessDetails
