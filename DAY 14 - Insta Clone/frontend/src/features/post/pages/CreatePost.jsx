import '../style/createPost.scss'

const CreatePost = () => {
  return (
    <main>
      <div className="form-container">
        <h1>Create Post</h1>
        <form>
          <label className="post-image-label" htmlFor="postImage">Select Image</label>
          <input hidden type="file" name="postImage" id="postImage" />
          <input type="text" name="caption" id="caption" placeholder="Enter Caption" />
          <button className="button primary-button">Create Post</button>
        </form>
      </div>
    </main>
  );
};

export default CreatePost;
