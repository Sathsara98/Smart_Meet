import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  // ViewQuestions renders a list of challenge questions in a table.
  // It supports editing and deleting questions unless readOnly is true.
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@material-ui/core";








function ViewQuestions({ questions, onDelete, onUpdate, readOnly = false }) {
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({ dArea: "", body: "" });




  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const [hoverNo, setHoverNo] = useState(false);
  // Open the delete confirmation dialog for a specific question
  const [hoverYes, setHoverYes] = useState(false);


  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };


  const confirmDelete = () => {
    if (onDelete && selectedDeleteId) {
      onDelete(selectedDeleteId);
    }


    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };


  // Begin editing this question and prefill the form state
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedDeleteId(null);
  };




  const startEdit = (q) => {
    if (readOnly) return; // 🔒 block editing in read-only mode
    setEditingId(q._id);
    setFormState({ dArea: q.dArea, body: q.body });
  };




  const cancelEdit = () => {
    // After saving, leave edit mode
    setEditingId(null);
    setFormState({ dArea: "", body: "" });
  };




  const saveEdit = () => {
    if (!editingId || readOnly) return;




    if (onUpdate) {
      onUpdate(editingId, {
        dArea: formState.dArea,
        body: formState.body,
      });
    }




    cancelEdit();
  };




  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };




  return (
    <TableContainer className="mt-4 mb-4 challenge-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className="th-dev-area">
              <b>Development Area</b>
            </TableCell>
            <TableCell className="th-chal">
              <b>Challenge</b>
            </TableCell>
            <TableCell className="th-action">
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>




        <TableBody>
          {questions.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No challenges added yet.
              </TableCell>
            </TableRow>
          )}




          {questions.map((q) => (
            <TableRow key={q._id}>
              {/* Development Area */}
              <TableCell>
                {editingId === q._id && !readOnly ? (
                  <select
                    className="form-control"
                    value={formState.dArea}
                    onChange={(e) => handleChange("dArea", e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="Policy">Policy</option>
                    <option value="R&D">R&amp;D</option>
                    <option value="Technology">Technology</option>
                    <option value="Workforce">Workforce</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                ) : (
                  q.dArea
                )}
              </TableCell>




              {/* Challenge body */}
              <TableCell>
                {editingId === q._id && !readOnly ? (
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formState.body}
                    onChange={(e) => handleChange("body", e.target.value)}
                  />
                ) : (
                  q.body
                )}
              </TableCell>




              {/* Actions */}
              <TableCell className="action-col">
                <div>
                  {/* Read-only: no buttons at all */}
                  {readOnly ? (
                    <span className="text-muted">—</span>
                  ) : editingId === q._id ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-suc mr-2"
                        onClick={saveEdit}
                      >
                        <i className="fa fa-check" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-close"
                        onClick={cancelEdit}
                      >
                        <i className="fa fa-times" aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-edit mr-2"
                        onClick={() => startEdit(q)}
                      >
                        <i className="fa fa-pencil-alt"></i>




                      </button>




                      <button
                        type="button"
                        className="btn btn-sm btn-del"
                        onClick={() => handleDeleteClick(q._id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true" />
                      </button>




                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle id="alert-dialog-title">Delete Challenge</DialogTitle>




        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this challenge?
          </DialogContentText>
        </DialogContent>




        <DialogActions>
          <Button onClick={cancelDelete} color="default" style={{
            backgroundColor: hoverNo ? '#57585a' : '#6b6b6b',
            color: 'white',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
            border: 'none'
          }}

            onMouseEnter={() => setHoverNo(true)}
            onMouseLeave={() => setHoverNo(false)}
          >
            No
          </Button>




          <Button onClick={confirmDelete} color="secondary" variant="contained" style={{
            backgroundColor: hoverYes ? '#0a7a96' : '#0D97B9',
            color: 'white',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer',
            border: 'none'
          }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>




    </TableContainer>
  );
}




export default ViewQuestions;

