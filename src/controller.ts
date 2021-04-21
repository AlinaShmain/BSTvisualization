import { BinarySearchTree as BST } from "./binary-search-tree";

class Controller {
    private _binaryTree: BST<number> | undefined;

    private createBinaryTree(): void {
        this._binaryTree = new BST<number>();
    }

    init(): void {
        this.createBinaryTree();
        const addBtn = document.getElementsByClassName("control-panel__add-node-button")[0];
        addBtn.addEventListener("click", this.addNode.bind(this));

        const removeBtn = document.getElementsByClassName("control-panel__remove-node-button")[0];
        removeBtn.addEventListener("click", this.removeNode.bind(this));

        const findBtn = document.getElementsByClassName("control-panel__find-node-button")[0];
        findBtn.addEventListener("click", this.findNode.bind(this));
    }

    validateInputVal(val: string): Boolean {
        if (val) {
            const valNum = parseInt(val, 10);
            if (!isNaN(valNum)) {
                return true;
            }
            this.displayError("Please, input the number!");
            return false;
        }
        this.displayError(`Please, input the value!`);
        return false;
    }

    addNode(e: Event): void {
        const input: HTMLInputElement = document.getElementsByClassName("control-panel__add-node-input")[0] as HTMLInputElement;
        const key: string = input.value;

        const isValid = this.validateInputVal(key);

        if (isValid) {
            this._binaryTree?.insert(parseInt(key, 10));
        }

        input.value = "";
    }

    removeNode(e: Event): void {
        const input: HTMLInputElement = document.getElementsByClassName("control-panel__remove-node-input")[0] as HTMLInputElement;
        const key: string = input.value;

        const isValid = this.validateInputVal(key);

        if (isValid) {
            this._binaryTree?.remove(parseInt(key, 10));
        }

        input.value = "";
    }

    findNodeDom(data: number): HTMLDivElement | undefined {
        const nodes = document.getElementsByClassName("node") as HTMLCollectionOf<HTMLDivElement>;
        for (const node of Array.from(nodes)) {
            if (node.innerHTML === String(data)) {
                return node;
            }
        }
        return;
    }

    displayError(message: string): void {
        const error: HTMLDivElement = document.getElementsByClassName("error")[0] as HTMLDivElement;
        error.innerHTML = `${message}`;
        setTimeout(() => {
            error.innerHTML = "";
        }, 5000);
    }

    highlightNode(nodeDom: HTMLDivElement | undefined): void {
        if (nodeDom !== undefined) {
            nodeDom.style.background = "red";
            setTimeout(() => {
                nodeDom.style.background = "blue";
            }, 5000);
        }
    }

    findNode(e: Event): void {
        const input: HTMLInputElement = document.getElementsByClassName("control-panel__find-node-input")[0] as HTMLInputElement;
        const key: string = input.value;

        const isValid = this.validateInputVal(key);

        if (isValid) {
            const node = this._binaryTree?.find(parseInt(key, 10));
            if (node) {
                const nodeDom = this.findNodeDom(node.data);
                this.highlightNode(nodeDom);
            } else {
                this.displayError(`node ${key} was not found in the tree`);
            }
        }

        input.value = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const controller = new Controller();
    controller.init();
});
