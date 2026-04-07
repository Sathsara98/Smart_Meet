import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

function ViewQuestions({ questions, onDelete, onUpdate, readOnly = false }) {
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({ dArea: "", body: "" });

  const startEdit = (q) => {
    if (readOnly) return; // 🔒 block editing in read-only mode
    setEditingId(q._id);
    setFormState({ dArea: q.dArea, body: q.body });
  };

  const cancelEdit = () => {
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
                        onClick={() => onDelete && onDelete(q._id)}
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
    </TableContainer>
  );
}

export default ViewQuestions;