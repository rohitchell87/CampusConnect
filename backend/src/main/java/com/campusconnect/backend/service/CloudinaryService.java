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

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) {
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
