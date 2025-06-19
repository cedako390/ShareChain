package handler

import (
	"encoding/json"
	"goback/internal/model"
	"goback/internal/repository"
	"goback/internal/service"
	"goback/internal/dto"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

// CommonHandler обрабатывает запросы для общего пространства.
type CommonHandler struct {
	folderSvc    service.FolderService
	fileSvc      service.FileService
	whitelistSvc service.WhitelistService
	userRepo     repository.UserRepository // Нужен для получения модели пользователя
}

// NewCommonHandler создает новый обработчик для общего пространства.
func NewCommonHandler(fs service.FolderService, fls service.FileService, ws service.WhitelistService, ur repository.UserRepository) *CommonHandler {
	return &CommonHandler{
		folderSvc:    fs,
		fileSvc:      fls,
		whitelistSvc: ws,
		userRepo:     ur,
	}
}

// getCurrentUser получает полную модель пользователя из контекста.
func (h *CommonHandler) getCurrentUser(r *http.Request) (*model.User, error) {
	userID := GetUserIDFromContext(r.Context())
	if userID == 0 {
		return nil, &httpError{message: "Unauthorized", code: http.StatusUnauthorized}
	}
	user, err := h.userRepo.GetByID(userID)
	if err != nil {
		return nil, &httpError{message: "User not found", code: http.StatusUnauthorized}
	}
	return user, nil
}

// httpError для удобной обработки ошибок в хендлерах.
type httpError struct {
	message string
	code    int
}

func (e *httpError) Error() string {
	return e.message
}

// --- Папки ---

// ListRootFoldersHandler — GET /api/common/folders (возвращает корневые папки)
func (h *CommonHandler) ListRootFoldersHandler(w http.ResponseWriter, r *http.Request) {
	user, _ := h.getCurrentUser(r) // если неавторизован, canWrite всегда false
	folders, err := h.folderSvc.ListCommonFolders(nil) // nil для корневых папок
	if err != nil {
		http.Error(w, "Failed to list root folders", http.StatusInternalServerError)
		return
	}
	var folderResponses []dto.FolderResponse
	for _, f := range folders {
		canWrite := false
		if user != nil {
			canWrite, _ = h.whitelistSvc.CanWrite(user, f.ID)
		}
		folderResponses = append(folderResponses, dto.FolderResponse{
			ID:        f.ID,
			Name:      f.Name,
			ParentID:  f.ParentID,
			IsCommon:  f.IsCommon,
			OwnerID:   f.OwnerID,
			CreatedBy: f.CreatedBy,
			CreatedAt: f.CreatedAt,
			CanWrite:  canWrite,
		})
	}
	files, err := h.fileSvc.ListCommonFiles(nil)
	if err != nil {
		http.Error(w, "Failed to list files", http.StatusInternalServerError)
		return
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

// ListChildrenHandler — GET /api/common/folders/{id}/children
func (h *CommonHandler) ListChildrenHandler(w http.ResponseWriter, r *http.Request) {
	user, _ := h.getCurrentUser(r)
	folderID, err := strconv.Atoi(chi.URLParam(r, "id"))
	if err != nil {
		http.Error(w, "Invalid folder ID", http.StatusBadRequest)
		return
	}
	folders, err := h.folderSvc.ListCommonFolders(&folderID)
	if err != nil {
		http.Error(w, "Failed to list folders", http.StatusInternalServerError)
		return
	}
	files, err := h.fileSvc.ListCommonFiles(&folderID)
	if err != nil {
		http.Error(w, "Failed to list files", http.StatusInternalServerError)
		return
	}
	var folderResponses []dto.FolderResponse
	for _, f := range folders {
		canWrite := false
		if user != nil {
			canWrite, _ = h.whitelistSvc.CanWrite(user, f.ID)
		}
		folderResponses = append(folderResponses, dto.FolderResponse{
			ID:        f.ID,
			Name:      f.Name,
			ParentID:  f.ParentID,
			IsCommon:  f.IsCommon,
			OwnerID:   f.OwnerID,
			CreatedBy: f.CreatedBy,
			CreatedAt: f.CreatedAt,
			CanWrite:  canWrite,
		})
	}
	// canWrite для текущей папки (куда можно создавать файлы/папки)
	canWriteCurrent := false
	if user != nil {
		canWriteCurrent, _ = h.whitelistSvc.CanWrite(user, folderID)
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
		Folders         []dto.FolderResponse `json:"folders"`
		Files           []dto.FileResponse   `json:"files"`
		CanWriteCurrent bool                 `json:"can_write_current"`
	}{
		Folders:         folderResponses,
		Files:           fileResponses,
		CanWriteCurrent: canWriteCurrent,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// CreateFolderHandler — POST /api/common/folders (создание подпапки)
func (h *CommonHandler) CreateFolderHandler(w http.ResponseWriter, r *http.Request) {
	user, err := h.getCurrentUser(r)
	if err != nil {
		http.Error(w, err.Error(), err.(*httpError).code)
		return
	}

	var req struct {
		Name     string `json:"name"`
		ParentID int    `json:"parent_id"` // В общем пространстве всегда есть родитель
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	// Проверка прав на запись в родительскую папку
	canWrite, err := h.whitelistSvc.CanWrite(user, req.ParentID)
	if err != nil || !canWrite {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	folder, err := h.folderSvc.CreateCommonFolder(req.Name, &req.ParentID, user.ID)
	if err != nil {
		http.Error(w, "Failed to create folder", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(folder)
}

// UpdateFolderHandler — PUT /api/common/folders/{id}
func (h *CommonHandler) UpdateFolderHandler(w http.ResponseWriter, r *http.Request) {
	user, err := h.getCurrentUser(r)
	if err != nil {
		http.Error(w, err.Error(), err.(*httpError).code)
		return
	}

	folderID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	canWrite, err := h.whitelistSvc.CanWrite(user, folderID)
	if err != nil || !canWrite {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	if err := h.folderSvc.RenameCommonFolder(folderID, req.Name); err != nil {
		http.Error(w, "Failed to rename folder", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// DeleteFolderHandler — DELETE /api/common/folders/{id}
func (h *CommonHandler) DeleteFolderHandler(w http.ResponseWriter, r *http.Request) {
	user, err := h.getCurrentUser(r)
	if err != nil {
		http.Error(w, err.Error(), err.(*httpError).code)
		return
	}
	folderID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	canWrite, err := h.whitelistSvc.CanWrite(user, folderID)
	if err != nil || !canWrite {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	if err := h.folderSvc.DeleteCommonFolder(folderID); err != nil {
		http.Error(w, "Failed to delete folder", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// --- Файлы ---

// GenerateUploadURLHandler — POST /api/common/folders/{id}/files/upload-url
func (h *CommonHandler) GenerateUploadURLHandler(w http.ResponseWriter, r *http.Request) {
	user, err := h.getCurrentUser(r)
	if err != nil {
		http.Error(w, err.Error(), err.(*httpError).code)
		return
	}

	folderID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	var req struct {
		Filename    string `json:"filename"`
		ContentType string `json:"content_type"`
		SizeBytes   int64  `json:"size_bytes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	canWrite, err := h.whitelistSvc.CanWrite(user, folderID)
	if err != nil || !canWrite {
		http.Error(w, "Forbidden to upload to this folder", http.StatusForbidden)
		return
	}

	uploadURL, key, err := h.fileSvc.GenerateUploadURL(r.Context(), &folderID, req.Filename, req.ContentType, req.SizeBytes, user.ID)
	if err != nil {
		http.Error(w, "Cannot generate upload URL", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{
		"upload_url": uploadURL,
		"storage_key": key,
	})
}

// RegisterUploadedFileHandler — POST /api/common/folders/{id}/files
func (h *CommonHandler) RegisterUploadedFileHandler(w http.ResponseWriter, r *http.Request) {
	user, err := h.getCurrentUser(r)
	if err != nil {
		http.Error(w, err.Error(), err.(*httpError).code)
		return
	}

	folderID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	var req struct {
		Name       string `json:"name"`
		StorageKey string `json:"storage_key"`
		SizeBytes  int64  `json:"size_bytes"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	canWrite, err := h.whitelistSvc.CanWrite(user, folderID)
	if err != nil || !canWrite {
		http.Error(w, "Forbidden to register file in this folder", http.StatusForbidden)
		return
	}

	file, err := h.fileSvc.RegisterUploadedFile(&folderID, req.Name, req.StorageKey, req.SizeBytes, user.ID)
	if err != nil {
		http.Error(w, "Cannot register file", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(file)
}

// GenerateDownloadURLHandler — GET /api/common/files/{id}/download-url
func (h *CommonHandler) GenerateDownloadURLHandler(w http.ResponseWriter, r *http.Request) {
	// Доступ на скачивание есть у всех аутентифицированных пользователей
	user, err := h.getCurrentUser(r)
	if err != nil {
		http.Error(w, err.Error(), err.(*httpError).code)
		return
	}

	fileID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	// Для общего файла ownerID не важен, сервис должен это обработать
	url, err := h.fileSvc.GenerateDownloadURL(r.Context(), fileID, user.ID)
	if err != nil {
		http.Error(w, "Cannot generate download URL", http.StatusForbidden)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"download_url": url})
}

// DeleteFileHandler — DELETE /api/common/files/{id}
func (h *CommonHandler) DeleteFileHandler(w http.ResponseWriter, r *http.Request) {
	user, err := h.getCurrentUser(r)
	if err != nil {
		http.Error(w, err.Error(), err.(*httpError).code)
		return
	}

	fileID, _ := strconv.Atoi(chi.URLParam(r, "id"))

	// Для удаления нужно проверить права на папку, в которой лежит файл
	file, err := h.fileSvc.GetFileMetadata(fileID, 0) // ownerID не важен
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	canWrite, err := h.whitelistSvc.CanWrite(user, *file.FolderID)
	if err != nil || !canWrite {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	// ownerID при удалении не важен, т.к. права уже проверены
	if err := h.fileSvc.DeleteFile(fileID, 0); err != nil {
		http.Error(w, "Cannot delete file", http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// UpdateFileHandler — PUT /api/common/files/{id}
func (h *CommonHandler) UpdateFileHandler(w http.ResponseWriter, r *http.Request) {
	user, err := h.getCurrentUser(r)
	if err != nil {
		http.Error(w, err.Error(), err.(*httpError).code)
		return
	}

	fileID, _ := strconv.Atoi(chi.URLParam(r, "id"))
	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid payload", http.StatusBadRequest)
		return
	}

	file, err := h.fileSvc.GetFileMetadata(fileID, 0)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	canWrite, err := h.whitelistSvc.CanWrite(user, *file.FolderID)
	if err != nil || !canWrite {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}
	// ownerID не важен, права проверены
	if err := h.fileSvc.RenameOrMoveFile(fileID, req.Name, *file.FolderID, 0); err != nil {
		http.Error(w, "Cannot rename file", http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}