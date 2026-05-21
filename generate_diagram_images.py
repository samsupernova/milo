import os
import re
import base64
import urllib.parse
import urllib.request
import json

def extract_mermaid_code(md_file):
    """Extract all mermaid code blocks from a markdown file."""
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all mermaid code blocks
    pattern = r'```mermaid\n(.*?)```'
    matches = re.findall(pattern, content, re.DOTALL)
    return matches

def generate_image_from_mermaid(mermaid_code, output_path):
    """Generate PNG image from Mermaid code using Mermaid.ink service."""
    try:
        # Encode the mermaid code
        encoded = base64.urlsafe_b64encode(mermaid_code.encode('utf-8')).decode('utf-8')
        
        # Use mermaid.ink service
        url = f"https://mermaid.ink/img/{encoded}"
        
        print(f"Generating: {output_path}")
        print(f"URL: {url[:100]}...")
        
        # Download the image
        urllib.request.urlretrieve(url, output_path)
        print(f"✓ Created: {output_path}")
        return True
    except Exception as e:
        print(f"✗ Error generating {output_path}: {e}")
        return False

def main():
    diagrams_dir = "diagrams"
    output_dir = os.path.join(diagrams_dir, "images")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Define diagram files and their output names
    diagram_files = {
        "use-case-diagram.md": [
            ("use-case-diagram.png", 0)
        ],
        "activity-diagram.md": [
            ("activity-user-registration.png", 0),
            ("activity-event-creation.png", 1),
            ("activity-join-event.png", 2),
            ("activity-event-discussion.png", 3),
            ("activity-user-authentication.png", 4)
        ],
        "dfd-diagrams.md": [
            ("dfd-level-0-context.png", 0),
            ("dfd-level-1-main-processes.png", 1),
            ("dfd-level-2-authentication.png", 2),
            ("dfd-level-2-event-management.png", 3),
            ("dfd-level-2-participation.png", 4)
        ],
        "er-diagram.md": [
            ("er-diagram.png", 0)
        ],
        "database-design.md": [
            ("database-schema.png", 0)
        ]
    }
    
    total_generated = 0
    total_failed = 0
    
    for md_file, outputs in diagram_files.items():
        md_path = os.path.join(diagrams_dir, md_file)
        
        if not os.path.exists(md_path):
            print(f"⚠ File not found: {md_path}")
            continue
        
        print(f"\n📄 Processing: {md_file}")
        mermaid_blocks = extract_mermaid_code(md_path)
        
        if not mermaid_blocks:
            print(f"  No mermaid diagrams found in {md_file}")
            continue
        
        print(f"  Found {len(mermaid_blocks)} diagram(s)")
        
        for output_name, index in outputs:
            if index < len(mermaid_blocks):
                output_path = os.path.join(output_dir, output_name)
                if generate_image_from_mermaid(mermaid_blocks[index], output_path):
                    total_generated += 1
                else:
                    total_failed += 1
            else:
                print(f"  ⚠ Index {index} out of range for {md_file}")
                total_failed += 1
    
    print(f"\n{'='*60}")
    print(f"✓ Successfully generated: {total_generated} images")
    if total_failed > 0:
        print(f"✗ Failed: {total_failed} images")
    print(f"📁 Output directory: {output_dir}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
