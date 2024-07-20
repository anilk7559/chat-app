/* eslint-disable jsx-a11y/label-has-associated-control */
import Loader from '@components/common-layout/loader/loader';
import { sellItemService } from '@services/sell-item.service';
import getConfig from 'next/config';
import Link from 'next/link';

import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';



function Blogs() {
  // const { publicRuntimeConfig: config } = getConfig();
    const [blogPosts, setBlogPosts] = useState([]);
    const userId = '6683cce9a5e475a6ac5c0731'; // Replace this with the actual user ID as needed
  
    const fetchAllBlogs = async () => {
        try {
          const blogs = await sellItemService.getAllBlogs(userId);
          setBlogPosts(blogs.data); // Assuming `blogs` is an array, otherwise adjust accordingly
        } catch (error) {
          console.error('Error fetching blog posts:', error);
        }
      }
    
      useEffect(() => {
        fetchAllBlogs();
      }, []);
      
    return (
      <div className='m-4'>
        <h1 style={{color: '#ff337c', fontWeight: 'medium', fontStyle: 'italic'}}>Blogs</h1>
        <Col md={12} className="flex justify-content-end mb-2">
              <Button onClick={() => Router.push('/blogs', '/blogs', { shallow: true })} className="btn btn-primary">
              Create Blog Posts
              </Button>
            </Col>
        <Row>
          {blogPosts.length === 0 && (
           <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }} className="w-full"> <Loader containerStyle="text-center" size="40px" /></div>
          )}
              {blogPosts?.map((item: any, index: any) => (
                <Col xs={12} sm={6} md={4} lg={4} key={item._id + index} data-toggle="tooltip" title={item.name}>
                  <div className="image-box mt-1 mb-1 active">
                    <img
                      alt="media_thumb_photo"
                      src={item?.media?.thumbUrl || '/images/default_thumbnail_photo.jpg'}
                    />
                    <div className="overlay" />
                  </div>
                  <div className="media-name">
                    {item.description.slice(0, 100)}...
                  </div>
                 <Link href={`/blogs/${item._id}`}>
                 <Button style={{marginTop: '0.5vw'}}
                    variant="primary"
                    key="button-upload"
                  >
                    Read Now
                  </Button>
                 </Link>
                </Col>
              ))}
            </Row>
      </div>
    );
  }

  export default Blogs;
