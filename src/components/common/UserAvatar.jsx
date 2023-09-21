import React, { useMemo } from "react";
import { getImageUrl } from "../../helper/common";

const UserAvatar = ({ user, size, ...rest }) => {
  const dimension = useMemo(() => size ? size : 32, [size]);

  return (
    <>
      {user?.profile ? (
        <img
          src={getImageUrl(user?.profile)}
          alt={user?.username}
          width={dimension}
          height={dimension}
          style={rest?.style ? rest?.style : {}}
        />
      ) : (
        <span
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-secondary text-white"
          style={rest?.style ? { width: `${dimension}px`, height: `${dimension}px`, ...rest?.style } : { width: `${dimension}px`, height: `${dimension}px` }}
        >
          {(user?.username || "")?.charAt(0)?.toUpperCase()}
        </span>
      )}
    </>
  );
};

export default UserAvatar;
