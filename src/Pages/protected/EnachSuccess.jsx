import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { GetAadhaarDetailsById, GetMandateDetailsById, GetPaymentDetaisByID } from "../../api/Api_call";
import { toast } from "react-toastify";
import { useUserInfoContext } from "../../components/context/UserInfoContext";
import AdharCard from "../../components/utils/AdharCard";

const EnachSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mandateDetails, setmandateDetails] = useState(null);
  const [timer, setTimer] = useState(10);
  const [address, setaddress] = useState("");
  const transactionId = searchParams.get("id");
  const transactinType = searchParams.get("type");
  const { userInfo } = useUserInfoContext();

  const adharuser = userInfo?.kycInfo[0]?.aadhaar_number?.slice(8,12);
  const adharres = mandateDetails?.aadhaar_uid?.slice(8,12);

  const formattedDateTime = mandateDetails?.created_at
  ? new Date(mandateDetails.created_at).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  : "--";
  
  useEffect(() => {
    if (!transactionId || !transactinType) {
      navigate("/");
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      if(transactinType === "ENACH"){
        navigate("/process-loan", {replace: true});
      }else if(transactinType === "aadhaar"){
        navigate("/process-loan", {replace: true});
      }else{
        navigate("/", {replace: true});
      }
    }, 10000);

    return () => {
      clearInterval(countdown);
      clearTimeout(redirect);
    };
  }, [navigate]);

  // To Get ENACH Details 
  const GetMandateDetails = async () => {
    const req = {
      TransactionId:transactionId
    }
    if(transactionId){
      try {
        const response = await GetMandateDetailsById(req)
        if(response.status){
          setmandateDetails(response?.data)
        }else{
          toast.error(response.message || "Something went wrong!")
          // navigate("/")
        }
      } catch (error) {
        console.error("Error in GetMandateDetailsById", error)
      }
    }
  }

  // To Get Adhar Details 
  const GetAdharDetaisBy = async () => {
    const req = {
      unique_request_number: transactionId,
      aadhar_number: userInfo?.kycInfo[0]?.aadhaar_number,
      user_id: userInfo?.user_id,
      lead_id: userInfo?.lead_id,
      company_id: import.meta.env.VITE_COMPANY_ID,
      product_name: import.meta.env.VITE_PRODUCT_NAME
    };
    if (transactionId) {
      try {
        const response = await GetAadhaarDetailsById(req);
        if (response.status) {
          setmandateDetails(response?.aadhaar_Data);
          
          const add = response?.aadhaar_Data?.care_of 
          + ", " + response?.aadhaar_Data?.addresses[0]?.complete_address?.house 
          + ", " + response?.aadhaar_Data?.addresses[0]?.complete_address?.vtc 
          + ", " + response?.aadhaar_Data?.addresses[0]?.complete_address?.state 
          + ", " + response?.aadhaar_Data?.addresses[0]?.complete_address?.pc
          
          setaddress(add)
          const data = {...response?.aadhaar_Data, add}
          localStorage.setItem("aadhaarData", JSON.stringify(data))
        } else {
          toast.error(response.message || "Something went wrong!");
        }
        // console.log(mandateDetails);
      } catch (error) {
        console.error("Error in GetMandateDetailsById", error);
      }
    }
  };

  // To Get Payment Details 
  const   GetPaymentDetaisBy = async () => {
    const req = {
      TransactionId: transactionId,
    };
    if (transactionId) {
      try {
        const response = await GetPaymentDetaisByID(req);
        if (response.status) {
          setmandateDetails(response?.msg[0]);
        } else {
          toast.error(response.message || "Something went wrong!");
          // navigate("/")
        }
        // console.log(mandateDetails);
      } catch (error) {
        console.error("Error in GetMandateDetailsById", error);
      }
    }
  };


  useEffect(()=> {
    if(transactinType === "ENACH"){
      GetMandateDetails()
    }else if(transactinType === "pg"){
      GetPaymentDetaisBy()
    }else if(transactinType === "aadhaar"){
      GetAdharDetaisBy()
    }
  }, [])

  return (
    <div className="flex items-center justify-center rounded-xl border-t-4 border-t-green-500">
      <div className="bg-white py-12 px-4 rounded-xl shadow-lg text-center w-full">
        <h1 className="text-xl font-bold mb-4">
          {transactinType === "ENACH" && "eNACH Registration Successful 🎉" } 
          {transactinType === "aadhaar" && (adharres != adharuser ? <p className="text-red-500">Aadhaar Verification Mismathched!</p> : "Aadhaar Verification Successful 🎉")}
          {transactinType === "pg" && "Transaction Successful 🎉"}
        </h1>

        <div className="text-sm mb-2 m-auto max-md:w-full py-2">
            <p className="mb-1"><span className="font-semibold">{transactinType === "aadhaar" ? "Reference Id:" : "Transaction Id:"}</span> <span>{transactionId || "Null"}</span></p>
            {/* <p className="flex flex-col text-left mb-1"><span className="font-semibold">Bank Reference Number:</span><span>{mandateDetails?.bank_reference_number || "Null"}</span></p>
            <p className="flex flex-col text-left mb-1"><span className="font-semibold">Created At: </span><span>{formattedDateTime || "Null"}</span></p> */}
        </div>
        {transactinType === "ENACH" && <p className="mb-2">Your mandate has been registered successfully.</p>}
        {transactinType === "pg" && <>
          <p className="mb-2">Your Transaction is completed successfully.</p>
          <p className="mb-2 text-yellow-600"><span>Note: </span>Please wait for 24 to 48 Hours to Update your Payment Status.</p>
        </>
        }

        {/* {(transactinType === "aadhaar" && mandateDetails) && <div className="flex justify-center">
          <AdharCard
            name={mandateDetails?.name || "N/A"}
            dob={mandateDetails?.date_of_birth_masked || "N/A"}
            gender={mandateDetails?.gender || "N/A"}
            aadhaarNumber={mandateDetails?.aadhaar_uid || "N/A"}
            image={`data:image/jpeg;base64,${mandateDetails?.image}`}
          />
        </div>} */}

        {/* {address && <p className="text-sm my-5 text-primary font-semibold">{address}</p>} */}
        {transactinType === "aadhaar" && <p className="my-2">Your Aadhaar Verification is {adharres != adharuser ? "Pending." : "successfully Completed."}</p>}
        <p className="text-sm opacity-80 flex items-center justify-center">
          Redirecting in <b className="mx-2"> {timer} </b> seconds...
          {/* <Link className="ml-2 font-bold text-primary" to="/process-loan">Go to Home</Link> */}
          <p className="ml-2 font-bold text-primary cursor-pointer" onClick={()=> (transactinType === "ENACH" || transactinType === "aadhaar")  ? navigate("/process-loan", {replace: true}) : navigate("/", {replace: true}) } >Go to Home</p>
        </p>
      </div>
    </div>
  );
};

export default EnachSuccess;
