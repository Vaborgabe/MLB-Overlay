import { Rive } from "@rive-app/webgl2";
import React from "react";

interface props {
    GameData: {
        ante: number;
        time: string;
        focus: number;
        hosts: string[];
        playerOne: {
            name: string;
            link: string;
            lives: number;
            points: number;
            roundNum: number;
            prevHighScore: string;
            totalSpent: string;
            mlbTotal: string;
            mlbRecord: string;
            vouchers: string[];
        };
        playerTwo: {
            name: string;
            link: string;
            lives: number;
            points: number;
            roundNum: number;
            prevHighScore: string;
            totalSpent: string;
            mlbTotal: string;
            mlbRecord: string;
            vouchers: string[];
        };
    }
}

const HostRive = (hostProps: props) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [rive, setRive] = React.useState<Rive | null>(null);
    const [riveLoaded, setRiveLoaded] = React.useState(false);

    const [camPos, setCamPos] = React.useState<any>({
        p1Cam: {
            x: 0,
            y: 0,
            sx: 1,
            sy: 1,
        }
    });

    //React.useEffect(() => {});

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        

        const r = new Rive({
            src: "/hostRive.riv",
            canvas: canvas,
            artboard: "Artboard",
            stateMachines: "State Machine 1",
            autoplay: true,
            autoBind: true,
            onLoad: () => {
                r.resizeDrawingSurfaceToCanvas();
                console.log("Rive file loaded successfully");
                setRiveLoaded(true);
                const vmi = r.viewModelInstance;

                const pOCam = new VdoIframe("https://vdo.ninja/?view=Md7G9Zj&solo&room=broughtshowc&label=p1OBS");

                const bCamX = vmi.number("bCamX");
                // bCamX?.on((event) => {
                //     if (event !== undefined) {
                //         setCamPos((prev: any) => ({
                //             ...prev,
                //             p1Cam: {
                //                 ...prev.p1Cam,
                //                 x: event,
                //             }
                //         }));
                //     }
                // });
                const bCamY = vmi.number("bCamY");
                // bCamY?.on((event) => {
                //     if (event !== undefined) {
                //         setCamPos((prev: any) => ({
                //             ...prev,
                //             p1Cam: {
                //                 ...prev.p1Cam,
                //                 y: event,
                //             }
                //         }));
                //     }
                // });
                const bCamSX = vmi.number("bCamSX");
                // bCamSX?.on((event) => {
                //     if (event !== undefined) {
                //         setCamPos((prev: any) => ({
                //             ...prev,
                //             p1Cam: {
                //                 ...prev.p1Cam,
                //                 sx: event,
                //             }
                //         }));
                //     }
                // });
                const bCamSY = vmi.number("bCamSY");
                // bCamSY?.on((event) => {
                //     if (event !== undefined) {
                //         setCamPos((prev: any) => ({
                //             ...prev,
                //             p1Cam: {
                //                 ...prev.p1Cam,
                //                 sy: event,
                //             }
                //         }));
                //     }
                // });
                // setInterval(() => {
                //     // setCamPos((prev: any) => ({
                //     //     ...prev,
                //     //     p1Cam: {
                //     //         x: bCamX?.value ?? 0,
                //     //         y: bCamY?.value ?? 0,
                //     //         sx: bCamSX?.value ?? 1,
                //     //         sy: bCamSY?.value ?? 1,
                //     //     }
                //     // }));
                //     pOCam.updateTransform(
                //         bCamX?.value ?? 0,
                //         bCamY?.value ?? 0,
                //         bCamSX?.value ?? 1,
                //         bCamSY?.value ?? 1
                //     );
                // }, 5);
            },
        });
        
        setRive(r);
    }, []);

    React.useEffect(() => {
        if(!rive && !riveLoaded) return;
        updateRive(hostProps.GameData);
    }, [rive, riveLoaded, hostProps]);

    function updateRive(gameData: props["GameData"]) {
        if (!rive) return;

        const hostVMI = rive.viewModelInstance;
        if (!hostVMI) return;

        const logo = hostVMI.viewModel("LogoVM");

        const p1RoundNum = hostVMI.viewModel("BlueRN");
        const p2RoundNum = hostVMI.viewModel("Red RN");

        const pOneVouchers = [];
        const pTwoVouchers = [];

        for (let i = 0; i < 8; i++)  {
            const p1Voucher = hostVMI.viewModel(`p1v${i+1}`);
            const p2Voucher = hostVMI.viewModel(`p2v${i+1}`);
            if (p1Voucher) {
                pOneVouchers.push(p1Voucher);
            }
            if (p2Voucher) {
                pTwoVouchers.push(p2Voucher);
            }
        }
        
        hostVMI.number("Ante").value = gameData.ante;
        hostVMI.string("Time").value = gameData.time;
        hostVMI.number("HostNum").value = gameData.hosts.length;
        hostVMI.number("Focus").value = gameData.focus;
        hostVMI.string("BlueName").value = gameData.playerOne.name;
        hostVMI.string("RedName").value = gameData.playerTwo.name;
        hostVMI.number("blueLives").value = gameData.playerOne.lives;
        hostVMI.number("redLives").value = gameData.playerTwo.lives;
        hostVMI.string("BPrevHigh").value = gameData.playerOne.prevHighScore;
        hostVMI.string("RPrevHigh").value = gameData.playerTwo.prevHighScore;
        hostVMI.string("BSpent").value = gameData.playerOne.totalSpent;
        hostVMI.string("RSpent").value = gameData.playerTwo.totalSpent;
        hostVMI.string("BPTotal").value = gameData.playerOne.mlbTotal;
        hostVMI.string("RPTotal").value = gameData.playerTwo.mlbTotal;
        hostVMI.string("BPRecord").value = gameData.playerOne.mlbRecord;
        hostVMI.string("RPRecord").value = gameData.playerTwo.mlbRecord;

        const pointValues = ["None", "None", "None"];
        if(gameData.playerTwo.points >= 1) pointValues[2] = "Red";
        if(gameData.playerOne.points >= 1) pointValues[0] = "Blue";
        if(gameData.playerTwo.points >= 2) pointValues[1] = "Red";
        if(gameData.playerOne.points >= 2) pointValues[1] = "Blue";
        logo.enum("L").value = pointValues[0];
        logo.enum("C").value = pointValues[1];
        logo.enum("R").value = pointValues[2];

        p1RoundNum.number("RoundNum").value = gameData.playerOne.roundNum;
        p2RoundNum.number("RoundNum").value = gameData.playerTwo.roundNum;
        
        pOneVouchers.forEach((v, i) => {
            if (gameData.playerOne.vouchers[i]) {
                v.enum("select").value = gameData.playerOne.vouchers[i];
            } else {
                v.enum("select").value = "none";
            }
        });
        pTwoVouchers.forEach((v, i) => {
            if (gameData.playerTwo.vouchers[i]) {
                v.enum("select").value = gameData.playerTwo.vouchers[i];
            } else {
                v.enum("select").value = "none";
            }
        });
    }

    return(
        <>
            <canvas ref={canvasRef} style={{width: "100%", height: "100%", zIndex: 999}} />
            {/* <VDOFrame
                x={camPos.p1Cam.x}
                y={camPos.p1Cam.y}
                sX={camPos.p1Cam.sx}
                sY={camPos.p1Cam.sy}
            /> */}
        </>
    )
}

export default HostRive;

class VdoIframe {
    private iframe: HTMLIFrameElement;
    private containerDiv: HTMLDivElement;
    private src: string;
    private x: number;
    private y: number;
    private sX: number;
    private sY: number;

    constructor(src: string) {
        this.src = src;
        this.x = 0;
        this.y = 0;
        this.sX = 0;
        this.sY = 0;

        this.containerDiv = document.createElement("div");
        this.containerDiv.style.width = "1920px";
        this.containerDiv.style.height = "1080px";
        this.containerDiv.style.zIndex = "100";

        this.iframe = document.createElement("iframe");
        this.iframe.src = this.src;
        this.iframe.style.width = "100%";
        this.iframe.style.height = "100%";
        this.iframe.style.border = "none";
        this.iframe.allow = "document-domain;encrypted-media;sync-xhr;usb;web-share;cross-origin-isolated;midi *;geolocation;camera *;microphone *;fullscreen;picture-in-picture;display-capture;accelerometer;autoplay;gyroscope;screen-wake-lock;";
        this.containerDiv.appendChild(this.iframe);

        this.updateTransform();

        document.body.appendChild(this.containerDiv);
    }

    setPosition(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.updateTransform();
    }

    setX(x: number) {
        this.x = x;
        this.updateTransform();
    }
    setY(y: number) {
        this.y = y;
        this.updateTransform();
    }

    setScale(sX: number, sY: number) {
        this.sX = sX;
        this.sY = sY;
        this.updateTransform();
    }

    setScaleX(sX: number) {
        this.sX = sX;
        this.updateTransform();
    }
    setScaleY(sY: number) {
        this.sY = sY;
        this.updateTransform();
    }
    
    updateTransform(x?: number, y?: number, sX?: number, sY?: number) {
        if (x !== undefined) this.x = x;
        if (y !== undefined) this.y = y;
        if (sX !== undefined) this.sX = sX;
        if (sY !== undefined) this.sY = sY;

        this.containerDiv.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.sX}, ${this.sY})`;
    }

    remove() {
        if (this.containerDiv.parentNode) {
            this.containerDiv.parentNode.removeChild(this.containerDiv);
        }
    }
}