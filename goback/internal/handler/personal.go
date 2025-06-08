package handler

import (
	"encoding/json"
	"goback/internal/model"
	"log"
	"net/http"
	"strconv"

	"goback/internal/service"

	"github.com/go-chi/chi/v5"
)

type PersonalHandler struct {
	folderSvc service.FolderService
	fileSvc   service.FileService
	pinSvc    service.PinService
}

func NewPersonalHandler(folderSvc service.FolderService, fileSvc service.FileService, pinSvc service.PinService) *PersonalHandler {
	return &PersonalHandler{folderSvc: folderSvc, fileSvc: fileSvc, pinSvc: pinSvc}
}

// --- Работа с папками ---

func (h *PersonalHandler) CreateFolderHandler(w http.ResponseWriter, r *http.Request) {
	type req struct {
		Name     string `json:"name"`
		ParentID *int   `json:"parent_id"`
	}
	var body req
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}
	ownerID := GetUserIDFromContext(r.Context())
	f, err := h.folderSvc.CreatePersonalFolder(body.Name, body.ParentID, ownerID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	json.NewEncoder(w).Encode(f)
}

// ListFoldersHandler — GET /api/personal/folders?parent_id={id}
// This handler now returns both folders and files.
func (h *PersonalHandler) ListFoldersHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	query := r.URL.Query().Get("parent_id")
	var parentID *int
	if query != "" {
		pid, err := strconv.Atoi(query)
		if err == nil {
			parentID = &pid
		}
	}

	// Fetch both folders and files
	folders, err := h.folderSvc.ListPersonalFolders(ownerID, parentID)
	if err != nil {
		http.Error(w, "failed to list folders", http.StatusInternalServerError)
		return
	}

	files, err := h.fileSvc.ListFiles(ownerID, parentID)
	if err != nil {
		http.Error(w, "failed to list files", http.StatusInternalServerError)
		return
	}

	// Combine into a single response
	resp := struct {
		Folders []model.Folder `json:"folders"`
		Files   []model.File   `json:"files"`
	}{
		Folders: folders,
		Files:   files,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *PersonalHandler) GetFolderHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))
	folder, err := h.folderSvc.GetPersonalFolder(id, ownerID)
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(folder)
}

func (h *PersonalHandler) UpdateFolderHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))
	var body struct {
		Name     *string `json:"name,omitempty"`
		ParentID *int    `json:"parent_id,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}
	if body.Name != nil {
		if err := h.folderSvc.RenameFolder(id, *body.Name, ownerID); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
	}
	if body.ParentID != nil {
		if err := h.folderSvc.MoveFolder(id, body.ParentID, ownerID); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *PersonalHandler) DeleteFolderHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))
	if err := h.folderSvc.DeleteFolder(id, ownerID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// --- Работа с файлами ---

// ListChildrenHandler is now redundant and can be removed.

func (h *PersonalHandler) GenerateUploadURLHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	folderID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	_, err := h.folderSvc.GetPersonalFolder(folderID, ownerID)
	if err != nil {
		http.Error(w, "no access", http.StatusForbidden)
		return
	}
	var body struct {
		Filename    string `json:"filename"`
		ContentType string `json:"content_type"`
		SizeBytes   int64  `json:"size_bytes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}
	uploadURL, key, err := h.fileSvc.GenerateUploadURL(r.Context(), folderID, body.Filename, body.ContentType, body.SizeBytes, ownerID)
	if err != nil {
		log.Println(err)
		http.Error(w, "cannot generate upload URL", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{
		"upload_url":  uploadURL,
		"storage_key": key,
	})
}

func (h *PersonalHandler) RegisterUploadedFileHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	folderID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	_, err := h.folderSvc.GetPersonalFolder(folderID, ownerID)
	if err != nil {
		http.Error(w, "no access", http.StatusForbidden)
		return
	}
	var body struct {
		Name       string `json:"name"`
		StorageKey string `json:"storage_key"`
		SizeBytes  int64  `json:"size_bytes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}
	f, err := h.fileSvc.RegisterUploadedFile(folderID, body.Name, body.StorageKey, body.SizeBytes, ownerID)
	if err != nil {
		http.Error(w, "cannot register file", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(f)
}

func (h *PersonalHandler) GenerateDownloadURLHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	fileID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	url, err := h.fileSvc.GenerateDownloadURL(r.Context(), fileID, ownerID)
	if err != nil {
		http.Error(w, "cannot generate download URL", http.StatusForbidden)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"download_url": url})
}

func (h *PersonalHandler) GetFileMetadataHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	fileID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	f, err := h.fileSvc.GetFileMetadata(fileID, ownerID)
	if err != nil {
		http.Error(w, "not found or no access", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(f)
}

func (h *PersonalHandler) UpdateFileHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	fileID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	var body struct {
		Name     *string `json:"name,omitempty"`
		FolderID *int    `json:"folder_id,omitempty"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}
	if body.Name != nil {
		if err := h.fileSvc.RenameOrMoveFile(fileID, *body.Name, 0, ownerID); err != nil {
			http.Error(w, "cannot rename", http.StatusBadRequest)
			return
		}
	}
	if body.FolderID != nil {
		if err := h.fileSvc.RenameOrMoveFile(fileID, "", *body.FolderID, ownerID); err != nil {
			http.Error(w, "cannot move", http.StatusBadRequest)
			return
		}
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *PersonalHandler) DeleteFileHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	fileID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	if err := h.fileSvc.DeleteFile(fileID, ownerID); err != nil {
		http.Error(w, "cannot delete", http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// --- Работа с «закрепами» (pins) ---

func (h *PersonalHandler) ListPinsHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	pins, err := h.pinSvc.ListPins(ownerID)
	if err != nil {
		http.Error(w, "cannot list pins", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(pins)
}

func (h *PersonalHandler) AddPinHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	var body struct {
		FolderID int `json:"folder_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}
	if err := h.pinSvc.AddPin(ownerID, body.FolderID); err != nil {
		http.Error(w, "cannot add pin", http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *PersonalHandler) RemovePinHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	folderID, _ := strconv.Atoi(chi.URLParam(r, "folder_id"))
	if err := h.pinSvc.RemovePin(ownerID, folderID); err != nil {
		http.Error(w, "cannot remove pin", http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}
