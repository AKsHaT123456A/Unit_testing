import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';
import UserModel from '../models/userModel.js';
import PostModel from '../models/postModel.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Post Controller Tests', () => {
    let testUser;
    let testPost;

    before(async () => {
        await UserModel.deleteMany({});
        await PostModel.deleteMany({});

        // Create a test user
        testUser = new UserModel({
            username: 'testinguser',
            password: 'testpassword',
        });
        await testUser.save();
    });

    beforeEach(async () => {
        // Create a test post
        testPost = new PostModel({
            userId: testUser._id,
            title: 'Test Post',
            desc: 'This is a test post.',
        });
        await testPost.save();
    });

    after(async () => {
        await UserModel.deleteMany({});
        await PostModel.deleteMany({});
    });

    it('should create a new post', async () => {
        const newPostData = {
            userId: testUser._id,
            title: 'New Post',
            desc: 'This is a new post.',
        };

        const res = await chai.request(app)
            .post('/api/posts')
            .send(newPostData)
            .set('token', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFrc2hhdCIsImlkIjoiNjRkYmYyNTU2M2Q3ZTI0MDczOGIzOTdjIiwiaWF0IjoxNjkyMTM2MDI4LCJleHAiOjE2OTIxMzk2Mjh9.WDRwvxqVRJhVPxS_fc1Q4MGUriDr7eZjWfvXyE_3xuE`);;

        expect(res).to.have.status(200);
        expect(res.body).to.have.property('_id');
    });

    it('should fail to create a post with missing title', async () => {
        const newPostData = {
            userId: testUser._id,
            desc: 'This is a post without a title.',
        };

        const res = await chai.request(app)
            .post('/api/posts')
            .send(newPostData)
            .set('token', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFrc2hhdCIsImlkIjoiNjRkYmYyNTU2M2Q3ZTI0MDczOGIzOTdjIiwiaWF0IjoxNjkyMTM2MDI4LCJleHAiOjE2OTIxMzk2Mjh9.WDRwvxqVRJhVPxS_fc1Q4MGUriDr7eZjWfvXyE_3xuE`);;

        expect(res).to.have.status(400);
        expect(res.body).to.equal('Title is Missing');
    });
    describe('GET /api/posts/:id', () => {
        it('should get a post by ID', async () => {
            // Create a post
            const newPostData = {
                title: 'Test Post',
                desc: 'This is a test post.',
            };
            const newPost = new PostModel(newPostData);
            await newPost.save();

            // Make a request to get the post
            const res = await chai.request(app)
                .get(`/api/posts/${newPost._id}`)
                .set('token', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFrc2hhdCIsImlkIjoiNjRkYmYyNTU2M2Q3ZTI0MDczOGIzOTdjIiwiaWF0IjoxNjkyMTM2MDI4LCJleHAiOjE2OTIxMzk2Mjh9.WDRwvxqVRJhVPxS_fc1Q4MGUriDr7eZjWfvXyE_3xuE`);;

            expect(res).to.have.status(200);
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('title');
            expect(res.body).to.have.property('desc');
        });

        it('should fail to get a non-existing post', async () => {
            // Make a request to get a post with an invalid ID
            const res = await chai.request(app)
                .get('/api/posts/jrkrnrk')
                .set('token', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFrc2hhdCIsImlkIjoiNjRkYmYyNTU2M2Q3ZTI0MDczOGIzOTdjIiwiaWF0IjoxNjkyMTM2MDI4LCJleHAiOjE2OTIxMzk2Mjh9.WDRwvxqVRJhVPxS_fc1Q4MGUriDr7eZjWfvXyE_3xuE`);;

            expect(res).to.have.status(500);
        });
    });

    describe('DELETE /api/deletePost/:id', () => {
        it('should delete a post', async () => {
            // Create a post
            const newPostData = {
                title: 'Test Post',
                desc: 'This is a test post.',
                userId: '64dbf2ccd1a21161be79d31d',
            };
            const newPost = new PostModel(newPostData);
            await newPost.save();

            // Make a request to delete the post
            const res = await chai.request(app)
                .delete(`/api/posts/${newPost._id}`)
                .set('token', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFrc2hhdCIsImlkIjoiNjRkYmYyY2NkMWEyMTE2MWJlNzlkMzFkIiwiaWF0IjoxNjkyMTM2MTQxLCJleHAiOjE2OTIyMjI1NDF9.7IGvp3DoocOiq1KHaRwArER0ZQ64JaaoT8W2o41mZAA`);;

            expect(res).to.have.status(200);
            expect(res.body).to.equal('Post deleted.');
        });

        it('should fail to delete a post by a different user', async () => {
            // Create a post by another user
            const otherUserPostData = {
                title: 'Other User Post',
                desc: 'This is another user\'s post.',
                userId: 'wemkmr',
            };
            const otherUserPost = new PostModel(otherUserPostData);
            await otherUserPost.save();

            // Make a request to delete the other user's post
            const res = await chai.request(app)
                .delete(`/api/posts/${otherUserPost._id}`)
                .set('token', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFrc2hhdCIsImlkIjoiNjRkYmYyNTU2M2Q3ZTI0MDczOGIzOTdjIiwiaWF0IjoxNjkyMTM2MDI4LCJleHAiOjE2OTIxMzk2Mjh9.WDRwvxqVRJhVPxS_fc1Q4MGUriDr7eZjWfvXyE_3xuE`);;

            expect(res).to.have.status(403);
            expect(res.body).to.equal('Action forbidden');
        });
    });
    describe('PUT /api/comment/:id', () => {
        it('should post comments to a post', async () => {
            // Create a post
            const post = new PostModel({
                title: 'Test Post',
                desc: "Test Post Description"
            });
            await post.save();

            const res = await chai.request(app)
                .put(`/api/comment/${post._id}`)
                .set('token', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFrc2hhdCIsImlkIjoiNjRkYmYyNTU2M2Q3ZTI0MDczOGIzOTdjIiwiaWF0IjoxNjkyMTM2MDI4LCJleHAiOjE2OTIxMzk2Mjh9.WDRwvxqVRJhVPxS_fc1Q4MGUriDr7eZjWfvXyE_3xuE`)                .send({ comments: 'This is a comment.' });

            expect(res).to.have.status(200);
        });
    });

    describe('GET /api/all_posts', () => {
        it('should get timeline posts', async () => {
            // Create a user with posts
            const userWithPosts = new UserModel({
                username: 'testuserdd',
                password: 'testpassword',
            });
            await userWithPosts.save();

            // Create posts for the user
            const post1 = new PostModel({
                title: 'Post 1',
                userId: userWithPosts._id,
            });
            const post2 = new PostModel({
                title: 'Post 2',
                userId: userWithPosts._id,
            });
            await Promise.all([post1.save(), post2.save()]);

            const res = await chai.request(app)
                .get('/api/all_posts')
                .set('token', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFrc2hhdCIsImlkIjoiNjRkYmYyNTU2M2Q3ZTI0MDczOGIzOTdjIiwiaWF0IjoxNjkyMTM2MDI4LCJleHAiOjE2OTIxMzk2Mjh9.WDRwvxqVRJhVPxS_fc1Q4MGUriDr7eZjWfvXyE_3xuE`);;

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
        });
    });
});
