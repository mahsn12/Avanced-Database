export default function ThreadDetails() {
  return (
    <div className="container">
      <h2>MongoDB Schema Design Tips</h2>

      <div className="card">
        <strong>Question:</strong>
        <p>When should I embed vs reference documents in MongoDB?</p>
      </div>

      <div className="card">
        <strong>Student Reply:</strong>
        <p>You should embed when data is tightly related.</p>
      </div>

      <div className="card best">
        <strong>Instructor (Best Answer):</strong>
        <p>
          Embed for one-to-few relationships, reference for large or reusable data.
        </p>
        <button>👍 Upvote</button>
      </div>

      <textarea placeholder="Write a reply..." />
      <button>Post Reply</button>
    </div>
  );
}
