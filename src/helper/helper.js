import jwtDecode from "jwt-decode";
import axios from "axios";
import axiosInstance from "../api/base";

// To get username from token
export const getUsername = () => {
  const authTokens = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem('authTokens')) : null;

  if(!authTokens?.access) return Promise.reject("Cannot find Token");

  let decode = jwtDecode(authTokens?.access);

  return decode;
}

// authenticate function
export const authenticate = async (username) => {
  try {
    return await axios.post("/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exist" };
  }
};

// Get User
export const getUser = async ({ username }) => {
  try {
    const { data } = await axios.get(`/user/${username}`);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject("Couldn't get the user..." );
  }
};

export const loginUser = async ({ username, password }) => {
  try {
    if (username) {
      const { data } = await axios.post("/login", {
        username,
        password,
      });
      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't Match...!" });
  }
};

export const registerUser = async (credentials) => {
  try {
    const {
      data,
      status,
    } = await axios.post("/register", credentials);

    let { username, email } = credentials;

    /** Send Mail */
    if (status === 201) {
      await axios.post("/register-mail", {
        username,
        userEmail: email,
        text: "Your account is created successfully!",
      });
    }

    return Promise.resolve(data);
  } catch (error) {

    console.log(" Error ",error)

    return Promise.reject(error);
  }
};

export const generateOTP = async (username) => {
  try {
    const {
      data: { code },
      status,
    } = await axios.get("/generate-otp", { params: { username } });

    if (status === 201) {
      let { email:userEmail } = await getUser({ username });

      let text = `Your Password Recovery OTP is ${code}.Verify and recover your password.`;

      await axios.post('/register-mail',{username,userEmail,text,subject:"Password recovery OTP"})
    }

    return Promise.resolve(code);
  } catch (error) {
    return Promise.reject({error})
  }
};

export const verifyOTP = async ({username,code}) => {
  try {
    const {data,status} = await axios.get('/verify-otp',{params:{code,username}})

    return Promise.resolve({data,status})
  } catch (error) {
    return Promise.reject({error})   
  }
}

export const resetPassword = async (values) => {
  try {
    const {data,status} = await axios.put('/reset-password/',values)

    return Promise.resolve({data,status})
  } catch (error) {
    return Promise.reject({error})
  }
}

export const updateUser = async (values) => {
  try {
    const data = await axiosInstance.put("/update-user",values)
    return Promise.resolve(data)
  } catch (error) {
    return Promise.reject({error:"Could't Update Profile..."})
  }
}

export const getPost = async (id) => {
  try {
    const {data,status} = await axios.get(`/posts/${id}`)
    return Promise.resolve({status,data})
  } catch (error) {
    return Promise.reject("Couldn't fetch the post.")
  }
} 

export const refreshAccessToken = async () => {
  try {
    const authTokens = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null;
    const {data} = await axios.post("/token/refresh/",{refresh:authTokens?.refresh})
    return Promise.resolve(data)
  } catch (error) {
    console.log(" Error ",error)
    return Promise.reject({error})
  }
}