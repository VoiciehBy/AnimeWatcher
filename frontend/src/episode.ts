export class episode {
    public id: number;
    public no: number;
    public name: string;
    public watched: boolean;

    public constructor(id: number, no: number, name: string = "", watched: boolean) {
        this.id = id;
        this.no = no;
        this.name = name
        this.watched = watched;
    }
}