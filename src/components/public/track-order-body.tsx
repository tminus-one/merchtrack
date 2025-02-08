'use client';

import React from 'react';
import { FaBoxes, FaMoneyBill } from "react-icons/fa";
import { BiSolidShoppingBagAlt } from "react-icons/bi";
import { FaPersonCircleCheck, FaCheckToSlot } from "react-icons/fa6";
import { Button } from "@/components/ui/button";


function TrackOrderBody() {
  return (
    <div className='my-8 flex min-h-[80vh] w-full flex-col items-center justify-center'>
      <div className='flex w-3/5 flex-row items-center'>
        <p className='font-bold'>Track My Order: </p>
        <p className='m-2 w-1/5 rounded-md border-2 border-blue-500 bg-blue-500/50 p-4'>2201</p>
      </div>
      <div className='flex w-3/5 flex-col place-items-center rounded-md border-2 p-16'>
        <div className='flex w-full flex-row justify-between'>
          <div className='flex flex-col items-center justify-between'>
            <div className='flex items-center justify-center rounded-full bg-blue-100 p-4'>
              <FaMoneyBill className='size-7 text-primary' />
            </div>
            <p>To Pay</p>
            <div className="mt-4 size-4 rounded-full bg-blue-500"></div>
          </div>
          <div className='flex flex-col items-center justify-between'>
            <div className='flex items-center justify-center rounded-full bg-gray-100 p-4'>
              <FaBoxes className='size-7 text-gray-500' />
            </div>
            <p>Processing</p>
            <div className="mt-4 size-4 rounded-full bg-gray-200"></div>
          </div>
          <div className='flex flex-col items-center justify-between'>
            <div className='flex items-center justify-center rounded-full bg-gray-100 p-4'>
              <BiSolidShoppingBagAlt className='size-7 text-gray-500' />
            </div>
            <p>Finished</p>
            <div className="mt-4 size-4 rounded-full bg-gray-200"></div>
          </div>
          <div className='flex flex-col items-center justify-between'>
            <div className='flex items-center justify-center rounded-full bg-gray-100 p-4'>
              <FaPersonCircleCheck className='size-7 text-gray-500' />
            </div>
            <p>Distribution</p>
            <div className="mt-4 size-4 rounded-full bg-gray-200"></div>
          </div>
          <div className='flex flex-col items-center justify-between'>
            <div className='flex items-center justify-center rounded-full bg-gray-100 p-4'>
              <FaCheckToSlot className='size-7 text-gray-500' />
            </div>
            <p>Completed</p>
            <div className="mt-4 size-4 rounded-full bg-gray-200"></div>
          </div>
        </div>

        {/*<div>Milestones</div>*/}

        <p className='m-4'>Your order is currently pending. Order will be confirmed once you pay the initial or full payment.</p>
        
        <div>
          <Button className='m-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white' variant='outline'>View Order</Button>
          <Button className='m-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white' variant='outline'>Pay Order</Button>
        </div>
      </div>
    </div>
  );
}

export default TrackOrderBody;