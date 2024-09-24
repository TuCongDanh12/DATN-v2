import React from 'react'

const Process = ({ mainContent, process }) => {
  //   const process = [
  //     "Đơn đặt hàng",
  //     "Chứng từ bán hàng",
  //     "Hóa đơn bán hàng",
  //     "Thu tiền theo hóa đơn"
  //   ]
  return (
    <div className="flex justify-center">
      <div className="bg-white m-4 w-[90%] h-[80vh] flex items-center flex-col">
        <div className="py-2 font-bold">{mainContent}</div>
        <hr className="w-[95%] process-main" />
        <div className="w-full my-auto flex justify-center items-center flex-col max-[700px]:rotate-90 max-[700px]:-translate-x-12">
          <div className="!bg-[#FFCD29] h-4 w-[80%] max-[700px]:w-[400px]"></div>
          <div className="flex translate-y-[-1rem] w-[80%] justify-evenly max-[700px]:w-[400px]">
            {
              process.map((item, index) =>
                <div className='relative' key={index}>
                  <div className="size-4 bg-black rotate-45"></div>
                  <div className="text-nowrap max-[900px]:text-wrap max-[900px]:w-[80px] max-[700px]:-rotate-90 max-[700px]:-translate-y-20 text-center absolute left-1/2 translate-x-[-50%] translate-y-[10px]">
                    {item.content}
                  </div>
                  {/* <Link to={`/${item.url}`} className='text-nowrap max-[900px]:text-wrap max-[900px]:w-[80px] max-[700px]:-rotate-90 max-[700px]:-translate-y-20 text-center absolute left-1/2 translate-x-[-50%] translate-y-[10px]'>
                    {item.content}
                  </Link> */}
                </div>)
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Process