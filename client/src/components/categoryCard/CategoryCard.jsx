// import React from "react";
// import "./CategoryCard..scss";
// import { Link } from "react-router-dom";

// const CategoryCard = ({ item }) => {
//   console.log(item, "item del CategoryCard");

//   return (
//     <Link to={`/gigs?cat=${item.cat}`}>
//       <div className="catCard">
//         <img src={item?.img} alt="" />
//         <span className="desc">{item.desc}</span>
//         <span className="title">{item.title}</span>
//       </div>
//     </Link>
//   );
// };

// export default CategoryCard;

import React from "react";
import "./CategoryCard..scss";
import { Link } from "react-router-dom";

const CategoryCard = ({ item }) => {
  // const { isLoading, error, data } = useQuery({
  //   queryKey: ["gig"],
  //   queryFn: () =>
  //     newRequest.get(`/api/gigs`).then((res) => {
  //       return res.data;
  //     }),
  // });

  // console.log(data, "esta data es de mi gig");

  return (
    <Link to={`/gigs?cat=${item.cat}`}>
      <div className="catCard">
        <img src={item.img} alt="" />
        <span className="desc" style={{ fontWeight: "400" }}>
          {item.desc}
        </span>
        <span className="title">{item.title}</span>
      </div>
    </Link>
  );
};

export default CategoryCard;
