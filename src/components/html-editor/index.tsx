import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Bold,
  Italic,
  Link,
  Image,
  Video,
  List,
  ListOrdered,
  Ellipsis,
} from "lucide-react";
import "./style.css";

function extractVideoId(url: string) {
  if (url) {
    const videoIdMatches = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/
    );
    if (videoIdMatches && videoIdMatches.length > 1) {
      const embedUrl = `https://www.youtube.com/embed/${videoIdMatches[1]}`;
      return embedUrl;
    } else {
      console.error("Invalid YouTube URL");
      return null;
    }
  }
}

const HtmlEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [inlineContent, setInlineContent] = useState<string>("");

  const formatText = (tag: string, attributes?: string) => {
    document.execCommand(tag, false, attributes);
    updateHtmlContent();
  };

  const insertMedia = (type: "image" | "video" | "link") => {
    const url = prompt(`Enter ${type} URL:`);
    if (!url) return;

    switch (type) {
      case "image":
        const imgId = `img-${Date.now()}`;
        formatText(
          "insertHTML",
          `<p style="width: 100%; display: inline-block; position: relative; text-align: center;">
            <img src="${url}" alt="Image" id="${imgId}" style="max-width: 100%; height: auto; cursor: move;" />
          </p>`
        );
        setTimeout(() => {
          const imgElement = document.getElementById(imgId);
          if (imgElement) {
            makeImageResizable(imgElement);
          }
        }, 0);
        break;
      case "video":
        const videoId = `video-${Date.now()}`;
        formatText(
          "insertHTML",
          `<p style="position: relative; text-align: center; margin: 10px 0;">
              <iframe src="${extractVideoId(
                url
              )}" id="${videoId}" style="width: 600px; height: 400px; cursor: move; border: 1px solid #ccc;" frameborder="0" allowfullscreen></iframe>
              <div class="editor-resize-handle"></div>
            </p>`
        );
        setTimeout(() => {
          const videoElement = document.getElementById(videoId);
          if (videoElement) makeVideoResizable(videoElement);
        }, 0);
        break;
      case "link":
        const text = prompt("Link text:", url);
        formatText(
          "insertHTML",
          `<a href="${url}" target="_blank" rel="noopener noreferrer">${
            text || url
          }</a>`
        );
        break;
    }
  };

  const makeImageResizable = (imgElement: HTMLElement) => {
    imgElement.style.position = "relative";

    imgElement.onmousedown = (e) => {
      e.preventDefault();
      setResizeData({
        element: imgElement,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: imgElement.offsetWidth,
        startHeight: imgElement.offsetHeight,
      });
    };
  };

  const makeVideoResizable = (videoElement: HTMLElement) => {
    const container = videoElement.parentElement;
    if (!container) return;

    const handle = container.querySelector(
      ".editor-resize-handle"
    ) as HTMLElement;
    if (!handle) return;

    handle.onmousedown = (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = videoElement.offsetWidth;
      const startHeight = videoElement.offsetHeight;

      const onMouseMove = (e: MouseEvent) => {
        const newWidth = Math.max(50, startWidth + (e.clientX - startX));
        const newHeight = Math.max(50, startHeight + (e.clientY - startY));
        videoElement.style.width = `${newWidth}px`;
        videoElement.style.height = `${newHeight}px`;
      };
      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };
  };

  const [resizeData, setResizeData] = useState({
    element: null as HTMLElement | null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });

  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeData.element) return;

      const width = resizeData.startWidth + (e.clientX - resizeData.startX);
      const height = resizeData.startHeight + (e.clientY - resizeData.startY);

      resizeData.element.style.width = `${Math.max(50, width)}px`;
      resizeData.element.style.height = `${Math.max(50, height)}px`;
    };
    const handleMouseUp = () => {
      setResizeData({
        element: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
      });
      setIsResizing(false);
      updateHtmlContent();
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizeData]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const currentNode = range.startContainer;
        // Agar iframe yoki media yonida bo'lsa, yangi qatorni ostiga qo'shish
        const newParagraph = document.createElement("p");
        newParagraph.innerHTML = "<br>"; // Bo'sh qator qo'shish
        newParagraph.style.margin = "10px 0";
        newParagraph.style.width = "100%";
        newParagraph.style.textAlign = "left";
        // Agar iframe element bo'lsa, ostiga qo'shadi
        if (
          currentNode.parentElement?.tagName === "IFRAME" ||
          currentNode.nodeName === "IFRAME"
        ) {
          currentNode.parentElement?.parentElement?.insertAdjacentElement(
            "afterend",
            newParagraph
          );
        } else {
          range.insertNode(newParagraph);
        }

        // Kursorni yangi qatorga qo'yish
        const newRange = document.createRange();
        newRange.setStart(newParagraph, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
      updateHtmlContent();
    }
  };

  const updateHtmlContent = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  const addInlineStyles = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    tempDiv.querySelectorAll("ul").forEach((ul) => {
      ul.style.paddingLeft = "20px";
      ul.style.margin = "0";
    });

    tempDiv.querySelectorAll("ol").forEach((ol) => {
      ol.style.paddingLeft = "20px";
      ol.style.margin = "0";
    });

    tempDiv.querySelectorAll("p").forEach((p) => {
      p.style.margin = "10px 0";
    });

    tempDiv.querySelectorAll("img").forEach((img) => {
      const width = img.style.width || img.offsetWidth + "px";
      const height = img.style.height || img.offsetHeight + "px";
      img.style.width = width;
      img.style.height = height;
      img.style.maxWidth = "100%";
      img.style.cursor = "move";
    });

    tempDiv.querySelectorAll("iframe").forEach((iframe) => {
      const width = iframe.style.width || iframe.offsetWidth + "px";
      const height = iframe.style.height || iframe.offsetHeight + "px";
      iframe.style.width = width;
      iframe.style.height = height;
    });

    return tempDiv.innerHTML;
  };

  const saveContent = () => {
    const styledHtml = addInlineStyles(htmlContent);
    setInlineContent(styledHtml);
    alert("Content saved with inline styles!");
  };

  return (
    <div className="editor-wrapper">
      <div className="editor-toolbar">
        <Button onClick={() => formatText("bold")}>
          <Bold size={18} />
        </Button>
        <Button onClick={() => formatText("italic")}>
          <Italic size={18} />
        </Button>
        <Button onClick={() => formatText("insertUnorderedList")}>
          <List size={18} />
        </Button>
        <Button onClick={() => formatText("insertOrderedList")}>
          <ListOrdered size={18} />
        </Button>
        <Button
          onClick={() =>
            formatText(
              "insertHTML",
              `<p style="text-align: center; font-size: 20px; font-weight: bold;">...</p>`
            )
          }
        >
          <Ellipsis size={18} />
        </Button>
        <Button onClick={() => insertMedia("link")}>
          <Link size={18} />
        </Button>
        <Button onClick={() => insertMedia("image")}>
          <Image size={18} />
        </Button>
        <Button onClick={() => insertMedia("video")}>
          <Video size={18} />
        </Button>
        <Button onClick={saveContent}>Save</Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onKeyDown={handleKeyDown}
        onInput={updateHtmlContent}
        className="editor-content"
        data-placeholder="Start writing your story..."
      />

      <div className="editor-preview">
        <h3 className="preview-title">Preview</h3>
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: inlineContent || htmlContent }}
        />
      </div>
    </div>
  );
};

export default HtmlEditor;
