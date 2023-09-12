import React, { useMemo } from "react";
import { getImageUrl } from "../../helper/common";

const UserAvatar = ({user,chat}) => {
  const size = useMemo(() => chat ? 48 : 32,[chat])
  return (
    <>
      {user?.profile ? (
        <img
          src={getImageUrl(user?.profile)}
          alt={user?.username}
          width={size}
          height={size}
        />
      ) : (
        <span
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary text-white"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          {(user?.username || "")?.charAt(0)?.toUpperCase()}
        </span>
      )}
    </>
  );
};

export default UserAvatar;
