from PIL import Image, ImageDraw, ImageFilter

def redact_regions(image_path, regions, output_path, mode='blur', blur_radius=18):
    image = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(image)
    expand_percentage = 70

    for (x, y, z, k) in regions:
        expand_x = int(z * (expand_percentage / 100))
        expand_y = int(k * (expand_percentage / 100))
        x_expanded = max(0, x - expand_x)
        y_expanded = max(0, y - expand_y)
        z_expanded = z + 2 * expand_x
        k_expanded = k + 2 * expand_y

        if mode == 'blur':
            region = image.crop((x_expanded, y_expanded, x_expanded + z_expanded, y_expanded + k_expanded))
            blurred_region = region.filter(ImageFilter.GaussianBlur(radius=blur_radius))
            image.paste(blurred_region, (x_expanded, y_expanded))
        elif mode == 'box':
            draw.rectangle([x_expanded, y_expanded, x_expanded + z_expanded, y_expanded + k_expanded], fill="black")
    
    image.save(output_path)