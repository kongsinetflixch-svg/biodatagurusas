# Plan - Add School Logo Upload Button

The user wants a button to upload the school logo and is asking for a suggestion on its placement. I will add a prominent "Muat Naik Logo" button in the Admin Dashboard header, as this is the central location for administrative tasks.

## Proposed Changes

### 1. Admin Dashboard Integration
- Add a new "Muat Naik Logo" button to the `Admin Dashboard` header.
- This button will trigger the existing `schoolLogoInputRef` click event.
- Use the `ImageIcon` from `lucide-react` for the button icon.
- Style it to match the existing dashboard buttons (white text, glass-like background or primary blue).

### 2. UI Refinement
- Ensure the logo upload logic correctly updates all instances of the school logo throughout the app (Login, Profile, Admin, Print).
- The existing `handleSchoolLogoUpload` already handles Supabase storage and state update, so it just needs to be linked to the new button.

## Verification Plan

### Automated Tests
- No specific automated tests required for this UI change, but will verify build stability.

### Manual Verification
- Log in as the Superadmin (IC: 801022016573).
- Open the Admin Dashboard.
- Click the new "Muat Naik Logo" button.
- Confirm that the file picker opens.
- Upload a new image and verify it updates the logo in the dashboard, profile header, and print preview.
