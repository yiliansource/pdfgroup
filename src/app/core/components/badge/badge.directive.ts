import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
    selector: '[pg-badge]',
    host: {
        class: 'pg-badge',
    },
})
export class BadgeDirective implements OnInit, OnDestroy {
    // @Input('pg-badge-color')
    // public get color() {
    //     return this._color;
    // }
    // public set color(value: string) {
    //     this._color = value;
    //     this.updateColor();
    // }
    // private _color: string = 'black';

    private badgeElement: HTMLElement | undefined;

    @Input('pg-badge')
    public get content(): string | undefined {
        return this.__content;
    }
    public set content(value: string | undefined) {
        this.__content = value;
        this.updateContent();
    }
    private __content: string | undefined;

    constructor(
        private readonly elementRef: ElementRef<HTMLElement>,
        private readonly renderer: Renderer2
    ) {}

    ngOnInit() {
        this.badgeElement = this.createBadgeElement();
        this.updateContent();
    }
    ngOnDestroy() {
        if (this.renderer.destroyNode) {
            this.renderer.destroyNode(this.badgeElement);
        }
    }

    private createBadgeElement(): HTMLElement {
        const badgeElement = this.renderer.createElement('span') as HTMLElement;
        badgeElement.innerText = '3';
        badgeElement.classList.add('pg-badge-content');

        this.elementRef.nativeElement.appendChild(badgeElement);

        return badgeElement;
    }

    private updateContent(): void {
        if (this.badgeElement) {
            this.badgeElement.innerText = this.content ?? '';
        }
    }
}
