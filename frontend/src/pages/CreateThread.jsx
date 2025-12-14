export default function CreateThread() {
  return (
    <div className="container">
      <h2>Create New Thread</h2>

      <input placeholder="Thread Title" />
      <textarea placeholder="Short description..." />

      <input placeholder="Tags (e.g. MongoDB, Database Design)" />

      <button>Create Thread</button>
    </div>
  );
}
