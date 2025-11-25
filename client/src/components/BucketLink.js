import React from 'react'
import { Link } from 'react-router-dom'


const BucketLink = ({bucket}) => {


    return (
        <Link to={`/buckets/${bucket.id}`}>
            {bucket.name}
        </Link>
    )
}


export default BucketLink