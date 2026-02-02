import { getMapCenter4326 } from "../utils/wme";
import { getSdk } from "../sdk";
import { log } from "../logger";
import {
  ContinueSVG,
  ExitLeftSVG,
  ExitRightSVG,
  KeepLeftSVG,
  KeepRightSVG,
  NoneSVG,
  TurnLeftSVG,
  TurnRightSVG,
  UTurnSVG,
} from "../ui/turnSvgs";

export async function buildTurnPreview(): Promise<void> {
  let node: any;
  let turnData: any;
  let segmentArray: string[];
  const sdk = getSdk();

  const arrow = document.querySelector("div.arrow.turn-arrow-state-open.hover") as HTMLElement | null;
  if (arrow == null) {
    return;
  }

  segmentArray = arrow.dataset?.id?.split(/(f|r)/g) ?? [];
  segmentArray = segmentArray.filter((element) => element != null && element !== "");
  const segmentDetails = JSON.parse(
    `{"fromSegment": {"id":${segmentArray[0]},"direction":"${segmentArray[1]}"},"toSegment": {"id":${segmentArray[2]},"direction":"${segmentArray[3]}"}}`
  );
  const fromSeg = W.model.segments.getObjectById(segmentDetails.fromSegment.id);
  const toSeg = W.model.segments.getObjectById(segmentDetails.toSegment.id);

  function getNodeForSegmentDirection(segmentId: number, direction: "f" | "r"): any {
    const seg = sdk.DataModel.Segments.getById({ segmentId });
    if (!seg) {
      return null;
    }
    const nodeId = direction === "f" ? seg.toNodeId : seg.fromNodeId;
    if (!nodeId) {
      return null;
    }
    return W.model.nodes.getObjectById(nodeId);
  }

  if (segmentDetails.fromSegment.direction === "f") {
    node = getNodeForSegmentDirection(segmentDetails.fromSegment.id, "f");
  } else if (segmentDetails.fromSegment.direction === "r") {
    node = getNodeForSegmentDirection(segmentDetails.fromSegment.id, "r");
  } else {
    alert("Let The_Cre8r know about this PL. [Error 1]");
  }
  turnData = W.model.turnGraph.getTurnThroughNode(node, fromSeg, toSeg).turnData;
  if (turnData && turnData.turnGuidance) {
    console.log(turnData);
  }

  if (node.isConnectedToBigJunction() && !(turnData && turnData.turnGuidance)) {
    log("Node is Connected to Junction Box");
    let JBpaths: any;
    if (segmentDetails.fromSegment.direction === "f") {
      JBpaths = W.model.bigJunctions
        .getObjectById(W.selectionManager._getSelectedSegments()[0].attributes.toCrossroads[0])
        .getAllPossibleTurns();
    } else if (segmentDetails.fromSegment.direction === "r") {
      JBpaths = W.model.bigJunctions
        .getObjectById(W.selectionManager._getSelectedSegments()[0].attributes.fromCrossroads[0])
        .getAllPossibleTurns();
    } else {
      alert("Let The_Cre8r know about this PL. [Error 2]");
    }
    if (JBpaths) {
      for (let path = 0; path < JBpaths.length; path += 1) {
        if (JBpaths[path].fromVertex.segmentID === segmentDetails.fromSegment.id && JBpaths[path].toVertex.segmentID === segmentDetails.toSegment.id) {
          turnData = JBpaths[path].turnData;
        }
      }
    } else {
      if (segmentDetails.toSegment.direction === "f") {
        node = getNodeForSegmentDirection(segmentDetails.toSegment.id, "r");
      } else if (segmentDetails.toSegment.direction === "r") {
        node = getNodeForSegmentDirection(segmentDetails.toSegment.id, "f");
      } else {
        alert("Let The_Cre8r know about this PL. [Error 3]");
      }
      turnData = W.model.turnGraph.getTurnThroughNode(node, fromSeg, toSeg).turnData;
    }
  }

  let signPreviewHTML = "";
  if (turnData && turnData.turnGuidance) {
    const DefaultTurnHTML = `<div class="default-waze-selected"><div class="default-waze-selected-inner">Waze selected</div></div>`;
    let turnHTML: string;

    switch (turnData.instructionOpcode) {
      case null:
        turnHTML = DefaultTurnHTML;
        break;
      case "CONTINUE":
        turnHTML = ContinueSVG;
        break;
      case "EXIT_LEFT":
        turnHTML = ExitLeftSVG;
        break;
      case "EXIT_RIGHT":
        turnHTML = ExitRightSVG;
        break;
      case "KEEP_LEFT":
        turnHTML = KeepLeftSVG;
        break;
      case "KEEP_RIGHT":
        turnHTML = KeepRightSVG;
        break;
      case "NONE":
        turnHTML = NoneSVG;
        break;
      case "TURN_LEFT":
        turnHTML = TurnLeftSVG;
        break;
      case "TURN_RIGHT":
        turnHTML = TurnRightSVG;
        break;
      case "UTURN":
        turnHTML = UTurnSVG;
        break;
      default:
        turnHTML = '<div class="default-waze-selected-inner" style="color: red;">More Stuff<br> to Fix</div>';
        break;
    }

    const exitSigns = turnData.turnGuidance.exitSigns;
    if (exitSigns.length > 0) {
      for (let i = 0; i < exitSigns.length; i += 1) {
        signPreviewHTML += `<img class="inline-exit-sign" src="https://renderer-am.waze.com/renderer/v1/signs/${exitSigns[i].type}?text=${exitSigns[i].text}">`;
      }
    }

    const turnGuidance = turnData.turnGuidance;
    const viArray = turnGuidance.visualInstruction.split(" ");
    let visualInstructionHTML = "";
    for (let j = 0; j < viArray.length; j += 1) {
      if (viArray[j].includes("$RS-")) {
        const shield = turnGuidance.roadShields[viArray[j].replace("$", "")];
        visualInstructionHTML += `<span class="inline-road-shield"><img class="sign-image" src="https://renderer-am.waze.com/renderer/v1/signs/${shield.type}?text=${shield.text}">&nbsp;<span>${shield.direction ? shield.direction : ""}</span></span>`;
      } else {
        visualInstructionHTML += `<span class="inline-free-text">${viArray[j]}</span>`;
      }
    }

    let towardsHTML = "";
    if (turnGuidance.towards) {
      const towardsArray = turnGuidance.towards.split(" ");
      towardsHTML = '<div class="secondary-markup">';
      for (let j = 0; j < towardsArray.length; j += 1) {
        if (towardsArray[j].includes("$RS-")) {
          const shield = turnGuidance.roadShields[towardsArray[j].replace("$", "")];
          towardsHTML += `<span class="inline-road-shield"><img class="sign-image" src="https://renderer-am.waze.com/renderer/v1/signs/${shield.type}?text=${shield.text}">&nbsp;<span>${shield.direction ? shield.direction : ""}</span></span>`;
        } else {
          towardsHTML += `<span class="inline-free-text">${towardsArray[j]}</span>`;
        }
      }
      towardsHTML += "</div>";
    } else {
      towardsHTML = '<div class="secondary-markup markup-placeholder">Optional guidance</div>';
    }

    const htmlString = `<div class="turn-instructions-panel">
                                <div class="turn-preview-wrapper" style="margin: 6px 6px 0px 6px;">
                                  <div class="turn-preview" style="border-radius: 4px;">
                                    <div>
                                      <div class="turn-preview-inner">
                                        <span class="turn-preview-arrow-wrapper">
                                          ${turnHTML}
                                        </span>
                                        <span class="turn-preview-content">
                                          <div>XXX feet</div>
                                          <span class="exit-signs-preview">
                                            ${signPreviewHTML}
                                          </span>
                                          <div class="primary-markup">
                                             ${visualInstructionHTML}
                                          </div>
                                          ${towardsHTML}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>`;
    const adDiv =
      '<div id="wmersh-pc" style="margin: -8px 0px 0px 0px;background:lightgray;" data-original-title="...and users like you." ><span style="font-size:10px; margin:auto; text-align: center;display: block;">Preview Courtesy of Road Shield Helper</span></div>';
    const emptyDiv = '<div style="background:red"></div>';

    await new Promise((r) => setTimeout(r, 20));
    const ovlRoots = document.querySelectorAll('.overlay-container > [class^="root-"]');
    let toolTipDiv: Element | null = null;
    let adjacentDiv: Element | null = null;
    for (let i = 0; i < ovlRoots.length; i += 1) {
      if (!ovlRoots[i].querySelector("wz-card")) {
        toolTipDiv = ovlRoots[i];
        adjacentDiv = ovlRoots[i];
      }
    }
    if (toolTipDiv == null) {
      return;
    }

    if (turnGuidance.tts) {
      const turnDiv = toolTipDiv.querySelector('[class^="bordered-"]')?.parentElement;
      turnDiv?.insertAdjacentHTML("afterbegin", `<div id="wmersh-tts-link"style="text-align:center">TTS Override: ${turnGuidance.tts}</div>`);
      document.getElementById("wmersh-tts-link")?.addEventListener("click", () => {
        const center = getMapCenter4326();
        const audio = new Audio(
          `https://ttsgw.world.waze.com/TTSGateway/Text2SpeechServlet?content_type=audio%2Fmpeg&lat=${center.lat}&lon=${center.lon}&protocol=2&sessionid=12345654321&skipCache=true&type=street&validate_data=positive&version=6&lang=en-US&text=%20${turnGuidance.tts}%20`
        );
        audio.play();
      });
    }

    adjacentDiv?.insertAdjacentHTML("afterbegin", adDiv);
    adjacentDiv?.insertAdjacentHTML("afterbegin", htmlString);
    adjacentDiv?.insertAdjacentHTML("afterbegin", emptyDiv);

    $("#wmersh-pc").tooltip({ placement: "bottom", container: "body" });

    let ttsHtml: string;
    if (turnGuidance.tts) {
      ttsHtml = `<div id="wmersh-tts" data-original-title="TTS Override Active" style="display: inline-block; float:left;">
                               <i class="fa fa-volume-up" aria-hidden="true" style="color: orange;font-size: 18px;margin-left: 7px;vertical-align: middle;"></i>
                           </div>`;
      document.querySelector("#wmersh-tts-link")?.insertAdjacentHTML("beforebegin", ttsHtml);
      $("#wmersh-tts").tooltip();
    } else {
      ttsHtml = `<div id="wmersh-tts" data-original-title="Default TTS" style="display: inline-block; float:left;">
                               <i class="fa fa-volume-up" aria-hidden="true" style="color: #72767d;font-size: 18px;margin-left: 7px;vertical-align: middle;"></i>
                           </div>`;
    }
  }
}

export function turnPreviewObserver(): void {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      for (let i = 0; i < mutation.addedNodes.length; i += 1) {
        const node = mutation.addedNodes[i] as Element;
        if (node?.querySelector?.("wz-subhead4")) {
          buildTurnPreview();
        }
      }
    });
  });
  const overlay = document.querySelector(".overlay-container");
  if (overlay) {
    observer.observe(overlay, { childList: true });
  }
}
