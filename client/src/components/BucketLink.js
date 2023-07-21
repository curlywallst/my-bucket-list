import React, { useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from "./User";

const BucketLink = ({bucket}) => {


    return (
        <Link to={`/buckets/${bucket.id}`}>
            {bucket.name}
        </Link>
    )
}


export default BucketLink