from __future__ import annotations


def recursive_character_split(
    text: str,
    chunk_size: int = 512,
    chunk_overlap: int = 64,
    separators: list[str] | None = None,
) -> list[str]:
    if separators is None:
        separators = ["\n\n", "\n", ". ", " ", ""]

    if len(text) <= chunk_size:
        stripped = text.strip()
        return [stripped] if stripped else []

    sep = separators[0]
    remaining_separators = separators[1:]

    if sep == "":
        parts = list(text)
    else:
        parts = text.split(sep)

    chunks: list[str] = []
    current = ""

    for part in parts:
        candidate = (current + sep + part) if current else part
        if len(candidate) <= chunk_size:
            current = candidate
        else:
            if current:
                trimmed = current.strip()
                if trimmed:
                    chunks.append(trimmed)

            if len(part) > chunk_size and remaining_separators:
                sub_chunks = recursive_character_split(
                    part, chunk_size, chunk_overlap, remaining_separators
                )
                chunks.extend(sub_chunks)
                current = ""
            else:
                current = part

    if current:
        trimmed = current.strip()
        if trimmed:
            chunks.append(trimmed)

    if chunk_overlap > 0 and len(chunks) > 1:
        overlapped: list[str] = [chunks[0]]
        for i in range(1, len(chunks)):
            prev = chunks[i - 1]
            overlap_text = prev[-chunk_overlap:]
            merged = overlap_text + " " + chunks[i]
            if len(merged) <= chunk_size:
                overlapped.append(merged.strip())
            else:
                overlapped.append(chunks[i])
        chunks = overlapped

    return chunks
