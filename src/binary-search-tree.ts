import "./style.css";

class TreeNode<T> {
    private _data: T;
    private _left: TreeNode<T> | undefined;
    private _right: TreeNode<T> | undefined;

    constructor(data: T, left?: TreeNode<T>, right?: TreeNode<T>) {
        this._data = data;
        this._left = left;
        this._right = right;
    }

    get data(): T {
        return this._data;
    }

    set data(value: T) {
        this._data = value;
    }

    get left(): TreeNode<T> | undefined {
        return this._left;
    }

    set left(value: TreeNode<T> | undefined) {
        this._left = value;
    }

    get right(): TreeNode<T> | undefined {
        return this._right;
    }

    set right(value: TreeNode<T> | undefined) {
        this._right = value;
    }
}


export class BinarySearchTree<T> {
    private _root: TreeNode<T> | undefined;
    private _offsetNode: number = 100;

    get root(): TreeNode<T> | undefined {
        return this._root;
    }

    countNodes(n: TreeNode<T> | undefined): number {
        if (n === undefined) {
            return 0;
        }
        return 1 + this.countNodes(n.left) + this.countNodes(n.right);
    }

    insert(data: T): void {
        try {
            if (!data) { throw new Error("No data specified!"); }

            const newNode: TreeNode<T> = new TreeNode<T>(data);

            if (this._root === undefined) {
                this._root = newNode;

                this.printNode(undefined, newNode);
            } else {
                this._insertNode(this._root, newNode);
            }
        } catch (e) {
            alert(e.message);
        }
    }

    private _insertNode(node: TreeNode<T>, newNode: TreeNode<T>): void {
        if (newNode.data === node.data) {
            alert(`node ${newNode.data} have already exists in the tree`);
        } else if (newNode.data < node.data) {
            if (node.left === undefined) {
                node.left = newNode;

                this.printNode(node, newNode, true);
            } else {
                this._insertNode(node.left, newNode);
            }
        } else {
            if (node.right === undefined) {
                node.right = newNode;
                this.printNode(node, newNode);
            } else {
                this._insertNode(node.right, newNode);
            }
        }
    }

    createElement(options: { tag: string, classes?: string, attributeName?: string, attributeVal?: string, text?: string }): HTMLElement {
        const element = document.createElement(options.tag);

        if (options.classes) {
            element.classList.add(options.classes);
        }
        if (options.attributeName && options.attributeVal) {
            element.setAttribute(options.attributeName, options.attributeVal);
        }
        if (options.text) {
            element.innerHTML = options.text;
        }

        return element;
    }

    findNodeDom(data: T): HTMLDivElement | undefined {
        const nodes = document.getElementsByClassName("node") as HTMLCollectionOf<HTMLDivElement>;
        for (const node of Array.from(nodes)) {
            if (node.innerHTML === String(data)) {
                return node;
            }
        }
        return;
    }

    printEdge(parentNodeDom: HTMLElement, nodeDom: HTMLElement, level: HTMLElement, left: Boolean): void {
        const positionParent = this.getPositionAtCenter(parentNodeDom);
        if (positionParent !== undefined) {
            const distance = this.getDistanceBetweenElements(
                parentNodeDom,
                nodeDom,
            );
            if (distance !== undefined) {
                const edge = document.createElement("hr");
                edge.classList.add("edge");
                edge.style.width = `${distance}px`;

                const position = this.getPositionAtCenter(nodeDom);
                if (position !== undefined) {
                    edge.style.top = `${level.getBoundingClientRect().top - (position.y - positionParent.y - nodeDom.getBoundingClientRect().height) / 2}px`;

                    const deg: number = 180 / Math.PI * Math.atan2(positionParent.y - position.y, positionParent.x - position.x);

                    edge.style.left = left ? `${position.x - distance / 2 + Math.abs(position.x - positionParent.x) / 2}px` : `${position.x - distance / 2 - Math.abs(position.x - positionParent.x) / 2}px`;

                    edge.style.transform = left ? `rotate(${deg - 360}deg)` : `rotate(${deg}deg)`;

                    level.before(edge);
                }
            }
        }
    }

    createNode(node: TreeNode<T>, offsetLeft: string): HTMLElement {
        const nodeDom = this.createElement({
            tag: "div",
            classes: "node",
            text: String(node.data)
        });
        nodeDom.style.left = offsetLeft;

        return nodeDom;
    }

    createLevel(levelVal: number): HTMLElement {
        const level = this.createElement({
            tag: "div",
            classes: "level",
            attributeName: "data-level",
            attributeVal: `${levelVal}`,
        });
        return level;
    }

    printNode(node: TreeNode<T> | undefined, newNode: TreeNode<T> | undefined, left: Boolean = false): void {
        const layout = document.getElementsByClassName("tree-layout")[0];
        const layoutWidth = layout.getBoundingClientRect().width;
        const layoutLeft = layout.getBoundingClientRect().left;

        if (newNode !== undefined) {
            if (newNode === this._root) {
                const level = this.createLevel(0);
                layout.append(level);

                const nodeDomWidth: number = 25;
                const offsetLeft = `${layoutWidth / 2 - nodeDomWidth / 2}px`;
                const nodeDom = this.createNode(newNode, offsetLeft);
                level.append(nodeDom);
            }
            if (node !== undefined) {
                const parentNodeDom: HTMLDivElement | undefined = this.findNodeDom(node.data);
                if (parentNodeDom !== undefined) {
                    const parentLevelNode = parentNodeDom.parentElement;
                    if (parentLevelNode) {
                        const parentLevel: number = Number(parentLevelNode.getAttribute("data-level"));
                        const levelVal: number = parentLevel + 1;
                        let level = document.querySelector(`div[data-level="${levelVal}"]`) as HTMLElement;
                        if (!level) {
                            level = this.createLevel(levelVal);
                            layout.append(level);
                        }

                        const offsetLeft = left ? `${parentNodeDom.getBoundingClientRect().left - layoutLeft - (this._offsetNode - 20 * levelVal)}px` :
                        `${parentNodeDom.getBoundingClientRect().left - layoutLeft + (this._offsetNode - 20 * levelVal)}px`;
                        const nodeDom = this.createNode(newNode, offsetLeft);
                        level.append(nodeDom);

                        this.printEdge(parentNodeDom, nodeDom, level, left);
                    }
                }
            }
        }
    }

    clearTreeDom(): void {
        const layout = document.getElementsByClassName("tree-layout")[0];
        while (layout.firstChild) {
            layout.removeChild(layout.firstChild);
        }
    }

    remove(data: T): void {
        try {
            if (!data) { throw new Error("No data specified!"); }
            this._root = this._removeNode(this._root, data);

            this.clearTreeDom();

            this.printTree(this._root, undefined, true);
        } catch (e) {
            alert(e.message);
        }
    }

    printTree(node: TreeNode<T> | undefined, parent: TreeNode<T> | undefined, left: Boolean = false): void {
        if (node !== undefined) {
            this.printNode(parent, node, left);
            if (node.left !== undefined) {
                this.printTree(node.left, node, true);
            }
            if (node.right !== undefined) {
                this.printTree(node.right, node);
            }
        }
    }

    private _removeNode(node: TreeNode<T> | undefined, data: T): TreeNode<T> | undefined {
        try {
            if (!node) {
                if (node !== this.root) {
                    alert(`there is no such node ${data} in the tree`);
                    return;
                }
                throw new Error("Tree is empty!");
            }
            if (data === node.data) {
                if (node.left === undefined && node.right === undefined) {
                    return;
                }
                if (node.left === undefined) {
                    return node.right;
                }
                if (node.right === undefined) {
                    return node.left;
                }
                let tempNode: TreeNode<T> | undefined = node.right;
                while (tempNode !== undefined && tempNode.left !== undefined) {
                    tempNode = tempNode.left;
                }
                if (tempNode !== undefined) {
                    node.data = tempNode.data;
                }
                node.right = this._removeNode(node.right, tempNode.data);
                return node;
            }
            if (data < node.data) {
                node.left = this._removeNode(node.left, data);
                return node;
            }
            node.right = this._removeNode(node.right, data);
            return node;
        } catch (e) {
            alert(e.message);
        }
    }

    find(data: T): TreeNode<T> | undefined {
        try {
            if (!data) { throw new Error("No data specified!"); }

            let current: TreeNode<T> | undefined = this._root;

            if (current === undefined) {
                throw new Error("Tree is empty!");
            }

            while (current.data !== data) {
                current = (data < current.data) ? current.left : current.right;
                if (!current) {
                    return;
                }
            }
            return current;
        } catch (e) {
            alert(e.message);
        }
    }

    getDistanceBetweenElements(a: HTMLElement | null, b: HTMLElement | null): number | undefined {
        const aPosition = this.getPositionAtCenter(a);
        const bPosition = this.getPositionAtCenter(b);
        if (aPosition !== undefined && bPosition !== undefined) {
            return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
        }
        return;
    }

    getPositionAtCenter(element: HTMLElement | null): { x: number; y: number } | undefined {
        if (element) {
            const { top, left, width, height } = element.getBoundingClientRect();
            return {
                x: left + width / 2,
                y: top + height / 2
            };
        }
        return;
    }

    inorderTraverse(node: TreeNode<T> | undefined, callback: Function): void {
        if (node) {
            node.left && this.inorderTraverse(node.left, callback);
            callback && callback(node.data);
            node.right && this.inorderTraverse(node.right, callback);
        }
    }

    preorderTraverse(node: TreeNode<T> | undefined, callback: Function): void {
        if (node !== undefined) {
            callback && callback(node.data);
            node.left && this.preorderTraverse(node.left, callback);
            node.right && this.preorderTraverse(node.right, callback);
        }
    }

    height(node: TreeNode<T> | undefined): number {
        if (node === undefined) { return 0; }
        return 1 + Math.max(this.height(node.left), this.height(node.right));
    }
}

