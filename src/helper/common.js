import htmlToDraft from "html-to-draftjs";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/base";
import _Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



export const capitalizeString = (str = " ") =>
  str?.charAt(0)?.toUpperCase() + str?.slice(1);

export const getLinesOfDescription = (description) => {
  const blocksFromHTML = htmlToDraft(description);

  return blocksFromHTML.contentBlocks.map((block) => block.text);
}

export const getImageUrl = (path) => `${process.env.REACT_APP_STATIC_BASE_URL}/${path}`

export const onfollow = async (user,setState) => {
  try {
    const followPromise = axiosInstance.put("/follow-user", {
      followUserId: user?._id,
    });

    toast.promise(followPromise, {
      loading: "Checking User...",
      success: `You have started following ${user?.username}.`,
      error: "Couldn't follow the user.",
    });

    followPromise.then(({ data:followers }) => {
      setState((state) => {
        return {
          ...state,
          data:state.data.map((followingUser) => (followingUser._id === user._id) ? {...followingUser,followers} : followingUser)
        }
      })
    });
  } catch (error) {
    return toast.error("Couldn't follow the user.");
  }
};

export const Swal = withReactContent(_Swal)