import { useState } from "react";
import styles from "./tabs.module.css";

export function Tabs({options, callback}: {options: React.ReactNode[], callback: (index: number, child: React.ReactNode) => void}) {
    const [selectedTab, setSelectedTab] = useState<number>(0);

    const handleTabClick = (index: number, child: React.ReactNode) => {
        setSelectedTab(index);
        callback(index, child);
        
    };

    return (
        <div className={styles.tabs}>
            {options.map((option, index) => {
                return (
                    <div className={(selectedTab === index) ? styles.selected : styles.deselected} key={index} onClick={() => handleTabClick(index, option)}>
                        {option}
                    </div>
                );
            })}
            <div className={styles.filler}></div>
        </div>
    );
}

// export function Tabs({children, callback}: {children: React.ReactNode, callback: (index: number, child: React.ReactNode) => void}) {
//     const [selectedTab, setSelectedTab] = useState<number>(0);

//     const handleTabClick = (index: number, child: React.ReactNode) => {
//         setSelectedTab(index);
//         callback(index, child);
        
//     };

//     useEffect(() => {
//         if (children && Array.isArray(children) && children.length > 0) {
//             const firstChild = children[0];
//             if (firstChild && typeof firstChild === 'object' && 'props' in firstChild) {
//                 const tabName = (firstChild as React.ReactElement).props['data-tab'];
//                 console.log(`First tab name: ${tabName}`);
//             }
//         }
//     }, [children]);

//     return (
//         <div className={styles.tabs}>
//             {children.map((child, index) => {
//                 return (
//                     <div className={(selectedTab == index)? styles.selected : styles.deselected} key={index}  onClick={(e) => handleTabClick(index, child)}>
//                         {child}
//                     </div>
//                 );
//             })}
//             <div className={styles.filler}></div>
//         </div>
//     );

// }