# MP3 File Analysis Application

A high-performance streaming API built with Node.js, TypeScript, and Express to count MPEG-1 Layer 3 frames in MP3 files.

# Technical implementation

### Memory-efficient streaming

The application utilizes **busboy** to pipe incoming file streams directly into the analyzer. By using a "sliding window" buffer approach, the service maintains near-constant memory usage (`O(1)` relative to file size), making it capable of processing multi-gigabyte files without memory exhaustion.

### Robust frame validation

To prevent false positives from random binary data, the parser implements a "look-ahead" strategy. It calculates the expected position of the next frame and verifies the sync word before confirming the current frame count.

### ID3v2 support

Implements synchsafe integer logic to correctly identify and skip ID3v2 headers, ensuring the frame count begins at the true start of the audio data.

### Bitwise optimization

Core parsing logic utilizes low-level bitwise operations and avoids heavy string conversions to ensure high throughput and minimal garbage collection pressure.

# Installation

### 1. Download the project
- **SSH:** `git clone git@github.com:rosslibby/mp3-analyser.git`
- **GitHub CLI:** `gh repo clone rosslibby/mp3-analyser`

### 2. Install the dependencies
- `npm install` (or `yarn`)

### 3. Build the project
- `npm run build`

<br>

# Usage

### Production mode

```bash
npm run build
npm start
```

### Development mode

```bash
npm run dev
```

**API endpoint:** `POST /file-upload`

**Field name:** `mp3`

```bash
# Test with a local file

curl -X POST http://localhost:3000/file-upload \
  -F "mp3=@path/to/sample (2).mp3"

# Expected response:
# {
#   "frameCount": 6089
# }
```

<br>

# Unit testing

The project uses **Vitest** for unit testing core logic. The tests focus on the most critical parts of the application: the binary parsing utilities and the frame validation logic.

### Running tests

To execute the test suite, run:

```bash
npm test
```

### Test Coverage
- **ID3 Tag Detection:** Verifies the identification of ID3v2 magic numbers.
- **Synchsafe Integer Calculation:** Validates the custom bit-shifting logic used to determine ID3 header sizes.
- **Header Validation:** Ensures that the parser correctly identifies valid vs. corrupted MPEG frame headers.
- **Lookup Tables:** Confirms that bitrate and sample rate indices map correctly to their respective constants.

# Lint
- `npm run lint`

### Verification

Results were verified using `mediainfo`: `mediainfo --fullscan path/to/sample.mp3 | grep "Frame count"`

<br>

# Project history

### Testing
I tested the endpoint against various edge cases to ensure robustness:

| File name | Context | Size | Result | Status |
|-|-|-|-|-|
|`[empty]`|No form data|-|`400: No file was uploaded`|✅|
|`blank.mp3`|0-byte file|0 B|`422: No valid MP3 frames detected`|✅|
|`sample (2).mp3`|Provided sample|1.46 MB|`200: { "frameCount": 6089 }`|✅|
|`john-render.mp3`|Large file (Scalability)|79.6 MB|`200: { "frameCount": 76169 }`|✅|
|`dear-maria.mp3`|MP3 data|2.9 MB|`200: { "frameCount": 7000 }`|✅|
|`dear-maria`|MP3 data, no extension|2.9 MB|`200: { "frameCount": 7000 }`|✅|
|`image.jpeg`|Invalid mime/data|672 KB|`400: Please upload a valid MP3 file`|✅|
