import React from "react";
import { Link } from "react-router-dom";
import "./Messages.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      newRequest.get(`/api/conversation`).then((res) => {
        return res.data;
      }),
    // queryFn: () =>
    //   newRequest.get(`conversation`).then((res) => {
    //     return res.data;
    //   }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.put(`/api/conversation/${id}`);
      // return newRequest.put(`conversation/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  console.log(data, "ESTA ES LA DATA QUE TRAIGO DE MESSAGES");

  return (
    <div className="messages">
      {isLoading ? (
        "Loading"
      ) : error ? (
        "Error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
          </div>
          <table>
            <tr>
              <th>{currentUser?.user?.isSeller ? "Buyer" : "Seller"}</th>
              <th>Last Message</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
            {data.map((c) => (
              <tr
                className={
                  ((currentUser?.user?.isSeller && !c.readyBySeller) ||
                    (!currentUser?.user?.isSeller && !c.readyByBuyer)) &&
                  "active"
                }
                key={c.id}
              >
                <td>{currentUser?.user?.isSeller ? c.buyerId : c.sellerId}</td>
                {console.log(c, "c")}
                <td>
                  <Link to={`/message/${c.id}`} className="link">
                    {c?.lastMessage?.substring(0, 100)}...
                  </Link>
                </td>
                <td>{moment(c.updatedAt).fromNow()}</td>
                <td>
                  {(currentUser?.user?.isSeller && !c.readyBySeller && (
                    <button onClick={() => handleRead(c.id)}>
                      Mark as Read
                    </button>
                  )) ||
                    (!currentUser?.user?.isSeller && !c.readyByBuyer && (
                      <button onClick={() => handleRead(c.id)}>
                        Mark as Read
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
    </div>
  );
};

export default Messages;
