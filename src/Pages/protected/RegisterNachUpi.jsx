import { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import QR from "../../assets/QR.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "../../components/utils/Card";
import Images from "../../components/content/Images";
import Button from "../../components/utils/Button";
import { useUserInfoContext } from "../../components/context/UserInfoContext";
import Loader from "../../components/utils/Loader";
import { GetMandateDetailsById, GetUPIMandateDetailsById, registerEMandateEaseBuze } from "../../api/Api_call";

function RegisterNachUpi() {
  const [loading, setLoading] = useState(false);
  const [QRResponse, setQRResponse] = useState({});

  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useUserInfoContext();

  const [searchParams] = useSearchParams();
  const txn = searchParams.get("id");

  // ------------------ FORM START ------------------------
  const form = useFormik({
    initialValues: {
      frequency: "",
      account_holder_name: "",
      upi_handle: "",
      auth_mode: "intent",
      request_type: "ENACH",
    },

    validationSchema: Yup.object({
      
    //   account_type: Yup.string().required("Account type is required"),

    //   upi_handle: Yup.string()
    //     .matches(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID (e.g. name@upi)")
    //     .required("UPI ID is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
        
      try {
        setLoading(true);

        const payload = {
          success_url: `${location.href}`,
          // failure_url: `${location.origin}/failure`,
          failure_url: `${location.origin}/failure`,
          amount: userInfo.getAssignProduct[0].loan_amount * 4,
          email: userInfo.personalInfo[0].email_id,
          phone: userInfo.mobile_number,
            // frequency: "onetime",
            frequency: "as_presented",
          mandate_type: "UPI",
          account_number: "",
          account_holder_name: userInfo.bankInfo[0]?.account_holder_name,
          ifsc: "",
          upi_handle: "9582207407@ptsbi",
          auth_mode: "intent",
          account_type: "savings",
          bank_code: "",
          request_type: "ENACH",
          company_name: "JUNOON",
          product_code: "JC",
          lead_id: userInfo.lead_id,
          user_id: userInfo.user_id,
          loan_id: "",
        };

        const response = await registerEMandateEaseBuze(payload);
        console.log(response);
        
        if (response) {
          setLoading(false);
          form.resetForm();
          openHTMLInSameTab(response);
        } else {
          setLoading(false);
          toast.error(response?.message || response?.error);
        }
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    },
  });

  const openHTMLInSameTab = (html) => {
    document.open();
    document.write(html);
    document.close();
  };

  const getmandate = async (req) => {
    try {
      const response = await GetMandateDetailsById(req);
      if (response.status) {
        if (response.data.status === "initiated") {
          console.log("Initiated======", response);
          return;
        }

        if (response.data.status === "authorized") {
          setQRResponse({});
          console.log("Success======", response);
          navigate(`/success?id=${req.TransactionId}&type=ENACH`);
        }

        if (response.data.status === "failed") {
          setQRResponse({});
          console.log("Failure======", response);
          navigate(`/failure?id=${req.TransactionId}&type=ENACH`);
        }
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Error in Mandate", error);
    }
  };

  const GetUPIMandateDetailsByIds = async (req) => {
    try {
      setLoading(true);
      const req = {
        TransactionId: txn,
        url: "verifiedu/GetUPIMandateDetailsById",
      };
      const response = await GetUPIMandateDetailsById(req);
      // if(response.status){
      setQRResponse(response);
      // }
    } catch (error) {
      console.log("ERROR IN GetUPIMandateDetailsById", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!txn) return;
    GetUPIMandateDetailsByIds({ TransactionId: txn });
  }, []);

  useEffect(() => {
    if (!txn || !QRResponse?.data?.qr_url) return;

    const interval = setInterval(() => {
      getmandate({ TransactionId: txn });
    }, 10000);

    // cleanup (VERY IMPORTANT)
    return () => clearInterval(interval);
  }, [txn, QRResponse?.data?.qr_url]);

  console.log(QRResponse);
  

  if (form.isSubmitting || loading)
    return <Loader message="Processing..." color="#63BB89" />;

  // ------------------ FORM END ------------------------

  return (
    <div>
      <div className="flex">
        <div className={`md:p-6 p-2 flex-1`}>
          {!QRResponse?.data?.qr_url && (
            <Card heading="Register eMandate UPI" style="bg-white">
              <form>
                <div className="flex justify-center">
                  <p className="text-sm text-center text-gray-600">
                    Please continue to register your eMandate & keep your Bank
                    Account & UPI details handy for hassle-free process.
                  </p>
                </div>
                <div>
                  <div className="flex justify-center items-center my-5">
                    <img src={Images.nach} alt="QR Code" className="h-36" />
                  </div>
                  <div className="flex justify-center items-center gap-2 my-5">
                    <Button
                      btnName={"Register eMandate"}
                      disabled={loading}
                      style={`bg-primary hover:bg-secondary hover:text-white text-white px-4 py-2`}
                      // onClick={registerNACH}
                      onClick={() => {form.submitForm()}}
                    />
                  </div>
                </div>
              </form>
            </Card>
          )}

          {QRResponse?.data?.qr_url && (
            <div className="flex items-center justify-center px-0">
              <div className="w-full bg-white rounded-2xl shadow-xl p-6 text-center border border-gray-100">
                {/* Heading */}
                <h2 className="text-xl font-semibold text-gray-800">
                  Complete Your Payment
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Scan the QR code using any UPI app
                </p>

                {/* QR Box */}
                <div className="mt-6 p-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <img
                    // src={QRResponse.qr_url}
                    src={QRResponse?.data.qr_url}
                    alt="UPI QR Code"
                    className="w-64 h-64 mx-auto object-contain"
                  />
                </div>

                {/* Instructions */}
                {/* <div className="mt-5 text-xs text-gray-600 space-y-1">
                  <p>• Open any UPI app</p>
                  <p>• Scan this QR code</p>
                  <p>• Approve mandate / payment</p>
                </div> */}

                {/* Important Note */}
                <div className="mt-4 text-xs text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  ⚠️ Do not refresh or close this page until payment is
                  completed
                </div>

                {/* Optional: Transaction ID */}
                {QRResponse?.data.id && (
                  <p className="mt-4 text-xs text-gray-400">
                    Ref ID: {QRResponse.data.id}
                  </p>
                )}

                {/* Button (Optional fallback) */}
                <button
                  onClick={() =>
                    getmandate({
                      TransactionId: txn,
                    })
                  }
                  className="mt-5 w-full bg-primary hover:bg-primary/80 text-white py-2 rounded-lg transition cursor-pointer"
                >
                  I have completed payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterNachUpi;
