export class episode {
    public id: number;
    public no: number;
    public watched: boolean;

    public constructor(id: number, no: number, watched: boolean) {
        this.id = id;
        this.no = no;
        this.watched = watched;
    }
}