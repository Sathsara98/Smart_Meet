// Import React and useState hook.
// useState is used to store values that change in this component.
import React, { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
} from "@material-ui/core";


// ViewQuestions component.
// Purpose:
// 1. Display added challenges in a table.
// 2. Allow user to edit a challenge.
// 3. Allow user to delete a challenge with confirmation.
// 4. Disable edit/delete actions when readOnly is true.
function ViewQuestions({ questions, onDelete, onUpdate, readOnly = false }) {

  // Stores which question is currently being edited.
  // null means no row is being edited.
  const [editingId, setEditingId] = useState(null);

  // Stores temporary form values while editing.
  // WHY: User changes are kept here before clicking save.
  const [formState, setFormState] = useState({ dArea: "", body: "" });


  // Controls whether delete confirmation dialog is open.
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Stores the ID of the question selected for delete.
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  // Used to change No button color on hover.
  const [hoverNo, setHoverNo] = useState(false);

  // Used to change Yes button color on hover.
  const [hoverYes, setHoverYes] = useState(false);


  // Runs when user clicks delete icon.
  // Logic:
  // 1. Store selected question ID.
  // 2. Open delete confirmation dialog.
  const handleDeleteClick = (id) => {
    setSelectedDeleteId(id);
    setDeleteDialogOpen(true);
  };


  // Runs when user confirms delete.
  const confirmDelete = () => {
    // Check whether onDelete function exists and selected ID is available.
    // WHY: onDelete is passed from parent component.
    if (onDelete && selectedDeleteId) {
      onDelete(selectedDeleteId);
    }

    // Close dialog after delete.
    setDeleteDialogOpen(false);

    // Clear selected delete ID.
    setSelectedDeleteId(null);
  };


  // Runs when user cancels delete.
  const cancelDelete = () => {
    // Close delete confirmation dialog.
    setDeleteDialogOpen(false);

    // Clear selected delete ID.
    setSelectedDeleteId(null);
  };


  // Start editing a selected question.
  const startEdit = (q) => {
    // If readOnly mode is true, editing is blocked.
    // WHY: Completed/view-only submissions should not be edited.
    if (readOnly) return;

    // Store selected question ID as editing row.
    setEditingId(q._id);

    // Fill edit form with selected question data.
    setFormState({ dArea: q.dArea, body: q.body });
  };


  // Cancel editing.
  const cancelEdit = () => {
    // Remove editing row.
    setEditingId(null);

    // Clear temporary form values.
    setFormState({ dArea: "", body: "" });
  };


  // Save edited question.
  const saveEdit = () => {
    // If no row is being edited or page is read-only, stop function.
    if (!editingId || readOnly) return;

    // If parent passed onUpdate function, send updated values to parent.
    if (onUpdate) {
      onUpdate(editingId, {
        dArea: formState.dArea,
        body: formState.body,
      });
    }

    // Exit edit mode after saving.
    cancelEdit();
  };


  // Update temporary edit form values.
  // field can be "dArea" or "body".
  // value is what user selected/typed.
  const handleChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };


  return (
    // TableContainer wraps the challenge table.
    <TableContainer className="mt-4 mb-4 challenge-table">
      <Table>

        {/* Table header */}
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


        {/* Table body */}
        <TableBody>

          {/* If no challenges are added, show empty message */}
          {questions.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No challenges added yet.
              </TableCell>
            </TableRow>
          )}


          {/* Display each challenge as a table row */}
          {questions.map((q) => (
            <TableRow key={q._id}>

              {/* Development Area column */}
              <TableCell>
                {editingId === q._id && !readOnly ? (
                  // If this row is being edited, show dropdown.
                  <select
                    className="form-control"

                    // Current selected development area in edit form.
                    value={formState.dArea}

                    // Update development area while editing.
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
                  // If not editing, display development area as text.
                  q.dArea
                )}
              </TableCell>


              {/* Challenge body column */}
              <TableCell>
                {editingId === q._id && !readOnly ? (
                  // If this row is being edited, show textarea.
                  <textarea
                    className="form-control"
                    rows={2}

                    // Current challenge text in edit form.
                    value={formState.body}

                    // Update challenge text while editing.
                    onChange={(e) => handleChange("body", e.target.value)}
                  />
                ) : (
                  // If not editing, display challenge text.
                  q.body
                )}
              </TableCell>


              {/* Actions column */}
              <TableCell className="action-col">
                <div>
                  {/*
                   If readOnly is true, no edit/delete buttons are shown.
                   WHY: In view mode, user should only view the challenges.
                 */}
                  {readOnly ? (
                    <span className="text-muted">—</span>
                  ) : editingId === q._id ? (
                    <>
                      {/* Save edited row */}
                      <button
                        type="button"
                        className="btn btn-sm btn-suc mr-2"
                        onClick={saveEdit}
                      >
                        <i className="fa fa-check" aria-hidden="true" />
                      </button>

                      {/* Cancel edit mode */}
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
                      {/* Start edit mode for this row */}
                      <button
                        type="button"
                        className="btn btn-sm btn-edit mr-2"
                        onClick={() => startEdit(q)}
                      >
                        <i className="fa fa-pencil-alt"></i>
                      </button>


                      {/* Open delete confirmation dialog */}
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


      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={cancelDelete}>
        <DialogTitle id="alert-dialog-title">
          Delete Challenge
        </DialogTitle>


        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this challenge?
          </DialogContentText>
        </DialogContent>


        <DialogActions>

          {/* No button: cancel delete */}
          <Button
            onClick={cancelDelete}
            color="default"
            style={{
              backgroundColor: hoverNo ? '#57585a' : '#6b6b6b',
              color: 'white',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
              border: 'none'
            }}

            // Change hover state when mouse enters button.
            onMouseEnter={() => setHoverNo(true)}

            // Reset hover state when mouse leaves button.
            onMouseLeave={() => setHoverNo(false)}
          >
            No
          </Button>


          {/* Yes button: confirm delete */}
          <Button
            onClick={confirmDelete}
            color="secondary"
            variant="contained"
            style={{
              backgroundColor: hoverYes ? '#0a7a96' : '#0D97B9',
              color: 'white',
              transition: 'background-color 0.2s ease',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}


export default ViewQuestions;

