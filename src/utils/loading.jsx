import { useEffect, useState } from "react";


export const Loading = () => {

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [])

  return (
    <>
      {!showLoading ? 
      <div className="row">
        <div className="col-12 mt-4">
          <div className='indicator-progress d-flex justify-content-center text-success' style={{display: 'block'}}>
              <span className="fs-4">Please wait...</span>
              <span className='spinner-border spinner-border-lg  align-middle ms-2'></span>
          </div>
        </div>
      </div>
      :
      <div className="row">
        <div className="col-12 mt-4">
          <div className='indicator-progress d-flex justify-content-center text-danger' style={{display: 'block'}}>
              <span className="fs-4">No data available...</span>
          </div>
        </div>
      </div>
    }
    </>
  )

}