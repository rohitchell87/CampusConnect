package com.campusconnect.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.campusconnect.backend.exception.ImageUploadException;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for handling Cloudinary image uploads and deletions.
 */
@Service
public class CloudinaryService {

    private static final long MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    private static final String[] ALLOWED_CONTENT_TYPES = {
            "image/jpeg",
            "image/png",
            "image/webp"
    };

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Uploads an image file to Cloudinary.
     *
     * @param file the multipart image file to upload
     * @return the secure URL returned by Cloudinary
     * @throws ImageUploadException when the file is invalid or the upload fails
     */
    public String uploadImage(MultipartFile file) {
        validateImage(file);

        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "campusconnect/profile-images", "resource_type", "image"));
            Object secureUrl = result.get("secure_url");
            if (secureUrl != null) {
                return secureUrl.toString();
            }
            throw new ImageUploadException("Cloudinary did not return a secure_url");
        } catch (IOException ex) {
            throw new ImageUploadException("Failed to upload image to Cloudinary: " + ex.getMessage(), ex);
        } catch (RuntimeException ex) {
            throw new ImageUploadException("Cloudinary upload error: " + ex.getMessage(), ex);
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ImageUploadException("File cannot be empty.");
        }

        String contentType = file.getContentType();
        boolean allowed = false;
        if (contentType != null) {
            for (String allowedType : ALLOWED_CONTENT_TYPES) {
                if (allowedType.equalsIgnoreCase(contentType)) {
                    allowed = true;
                    break;
                }
            }
        }

        if (!allowed) {
            throw new ImageUploadException("Only JPG, PNG and WEBP images are allowed.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new ImageUploadException("Image size cannot exceed 5 MB.");
        }
    }

    /**
     * Deletes an image from Cloudinary by extracting its public ID from the URL.
     *
     * @param imageUrl the secure image URL from Cloudinary
     * @throws ImageUploadException when deletion fails or the URL cannot be parsed
     */
    public void deleteImage(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
        } catch (Exception ex) {
            throw new ImageUploadException("Failed to delete image from Cloudinary: " + ex.getMessage(), ex);
        }
    }

    private String extractPublicId(String imageUrl) throws URISyntaxException {
        URI uri = new URI(imageUrl);
        String path = uri.getPath();
        // path example: /<cloud_name>/image/upload/v1234567890/campusconnect/profile-images/abc123.jpg
        int uploadIdx = path.indexOf("/upload/");
        String candidate;
        if (uploadIdx >= 0) {
            candidate = path.substring(uploadIdx + "/upload/".length());
            // remove version prefix if present
            candidate = candidate.replaceFirst("^v\\d+(/)", "");
        } else {
            int folderIdx = path.indexOf("/campusconnect/profile-images/");
            if (folderIdx >= 0) {
                candidate = path.substring(folderIdx + 1); // remove leading slash
            } else {
                // fallback to last segment
                int lastSlash = path.lastIndexOf('/');
                candidate = lastSlash >= 0 ? path.substring(lastSlash + 1) : path;
            }
        }
        // remove file extension if present
        int dot = candidate.lastIndexOf('.');
        if (dot > 0) {
            candidate = candidate.substring(0, dot);
        }
        return candidate;
    }
}
