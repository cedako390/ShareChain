package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"goback/internal/service"
	"goback/internal/dto"

	"github.com/go-chi/chi/v5"
)

// PersonalHandler объединяет логику для папок, файлов и закрепов
type PersonalHandler struct {
	folderSvc service.FolderService
	fileSvc   service.FileService
	pinSvc    service.PinService
}

// NewPersonalHandler создаёт новый обработчик
func NewPersonalHandler(folderSvc service.FolderService, fileSvc service.FileService, pinSvc service.PinService) *PersonalHandler {
	return &PersonalHandler{folderSvc: folderSvc, fileSvc: fileSvc, pinSvc: pinSvc}
}

// --- Работа с папками ---

// CreateFolderHandler — POST /api/personal/folders
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
	if body.Name == "" {
		http.Error(w, "name is required", http.StatusBadRequest)
		return
	}
	f, err := h.folderSvc.CreatePersonalFolder(body.Name, body.ParentID, ownerID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	folderResp := dto.FolderResponse{
		ID:        f.ID,
		Name:      f.Name,
		ParentID:  f.ParentID,
		IsCommon:  f.IsCommon,
		OwnerID:   f.OwnerID,
		CreatedBy: f.CreatedBy,
		CreatedAt: f.CreatedAt,
		CanWrite:  true, // владелец всегда может писать в свою личную папку
	}
	json.NewEncoder(w).Encode(folderResp)
}

// ListFoldersHandler — GET /api/personal/folders?parent_id={id}
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
	var folderResponses []dto.FolderResponse
	for _, f := range folders {
		folderResponses = append(folderResponses, dto.FolderResponse{
			ID:        f.ID,
			Name:      f.Name,
			ParentID:  f.ParentID,
			IsCommon:  f.IsCommon,
			OwnerID:   f.OwnerID,
			CreatedBy: f.CreatedBy,
			CreatedAt: f.CreatedAt,
			CanWrite:  true, // владелец всегда может писать в свою личную папку
		})
	}
	var fileResponses []dto.FileResponse
	for _, file := range files {
		fileResponses = append(fileResponses, dto.FileResponse{
			ID:         file.ID,
			FolderID:   *file.FolderID,
			Name:       file.Name,
			StorageKey: file.StorageKey,
			SizeBytes:  file.SizeBytes,
			OwnerID:    file.OwnerID,
			CreatedAt:  file.CreatedAt,
			UpdatedAt:  file.UpdatedAt,
		})
	}
	resp := struct {
		Folders []dto.FolderResponse `json:"folders"`
		Files   []dto.FileResponse   `json:"files"`
	}{
		Folders: folderResponses,
		Files:   fileResponses,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// GetFolderHandler — GET /api/personal/folders/{id}
func (h *PersonalHandler) GetFolderHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))
	folder, err := h.folderSvc.GetPersonalFolder(id, ownerID)
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	folderResp := dto.FolderResponse{
		ID:        folder.ID,
		Name:      folder.Name,
		ParentID:  folder.ParentID,
		IsCommon:  folder.IsCommon,
		OwnerID:   folder.OwnerID,
		CreatedBy: folder.CreatedBy,
		CreatedAt: folder.CreatedAt,
		CanWrite:  true,
	}
	json.NewEncoder(w).Encode(folderResp)
}

// UpdateFolderHandler — PUT /api/personal/folders/{id}
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

// DeleteFolderHandler — DELETE /api/personal/folders/{id}
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

// GenerateUploadURLHandler — POST /api/personal/files/upload-url
func (h *PersonalHandler) GenerateUploadURLHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	var body struct {
		Filename    string `json:"filename"`
		ContentType string `json:"content_type"`
		SizeBytes   int64  `json:"size_bytes"`
		FolderID    *int   `json:"folder_id"` // Nullable for root
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}
	// Verify access to parent folder if it's not root
	if body.FolderID != nil {
		_, err := h.folderSvc.GetPersonalFolder(*body.FolderID, ownerID)
		if err != nil {
			http.Error(w, "no access to parent folder", http.StatusForbidden)
			return
		}
	}
	uploadURL, key, err := h.fileSvc.GenerateUploadURL(r.Context(), body.FolderID, body.Filename, body.ContentType, body.SizeBytes, ownerID)
	if err != nil {
		log.Printf("Error generating upload URL: %v", err)
		http.Error(w, "cannot generate upload URL", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{
		"upload_url":  uploadURL,
		"storage_key": key,
	})
}

// RegisterUploadedFileHandler — POST /api/personal/files
func (h *PersonalHandler) RegisterUploadedFileHandler(w http.ResponseWriter, r *http.Request) {
	ownerID := GetUserIDFromContext(r.Context())
	var body struct {
		Name       string `json:"name"`
		StorageKey string `json:"storage_key"`
		SizeBytes  int64  `json:"size_bytes"`
		FolderID   *int   `json:"folder_id"` // Nullable for root
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}
	// Verify access to parent folder
	if body.FolderID != nil {
		_, err := h.folderSvc.GetPersonalFolder(*body.FolderID, ownerID)
		if err != nil {
			http.Error(w, "no access to parent folder", http.StatusForbidden)
			return
		}
	}
	f, err := h.fileSvc.RegisterUploadedFile(body.FolderID, body.Name, body.StorageKey, body.SizeBytes, ownerID)
	if err != nil {
		http.Error(w, "cannot register file", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(f)
}

// GenerateDownloadURLHandler — GET /api/personal/files/{id}/download-url
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

// GetFileMetadataHandler — GET /api/personal/files/{id}
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

// UpdateFileHandler — PUT /api/personal/files/{id}
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

// DeleteFileHandler — DELETE /api/personal/files/{id}
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
