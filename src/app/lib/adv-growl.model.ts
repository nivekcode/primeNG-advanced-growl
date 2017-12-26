/**
 * Created by kevinkreuzer on 08.07.17.
 */
export interface AdvPrimeMessage {
    id: string;
    severity: string;
    summary: string;
    detail: string;
    lifeTime ?: number;
    additionalProperties?: any;
}
