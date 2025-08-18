import { Card } from "antd";
import { Link, useNavigate } from "react-router-dom";

export const Error404 = () => {
  let navigate = useNavigate();
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-4 col-sm-12"></div>
          <div className="col-md-4 col-sm-12 position-absolute top-50 start-50 translate-middle">
            <Card bordered={false}>
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12 text-center">
                      <img
                        width={200}
                        className="mb-2"
                        src="assets/images/logo/pbz1.png"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <p className="text-center mt-3 h3 fw-bold">
                        The People's Bank of Zanzibar
                      </p>
                      <p className="text-center h3 mt-3 fw-bold">
                        PBZ BANK
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <hr />
                      <div className="row">
                        <div className="col-12 text-center">
                          <img
                            width={400}
                            className="mb-2"
                            src="assets/images/logo/404.png"
                            alt=""
                          />
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-12 text-center">
                          <button
                            className="btn btn-soft-danger"
                            onClick={() => {
                              navigate(-1);
                            }}
                          >
                            Back to Previous
                          </button>
                        </div>
                      </div>
                      <hr />
                      <div className="row mt-5">
                        <div className="col-12 text-center">
                          <p className="text-info mb-0">
                            © {new Date().getFullYear()} &nbsp;{" "}
                            <span className="fw-bold">PBZ BANK</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-md-4 col-sm-12"></div>
        </div>
      </div>
    </>
  );
};
