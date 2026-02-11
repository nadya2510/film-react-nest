import {
  IsUUID,
  IsISO8601,
  IsNumber,
  IsString,
  IsEmail,
  Matches,
  ArrayMinSize,
  ValidateNested,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketDTO {
  @IsUUID()
  film: string;
  @IsUUID()
  session: string;
  @IsISO8601()
  daytime: Date;
  @IsNumber()
  @IsPositive()
  row: number;
  @IsNumber()
  @IsPositive()
  seat: number;
  @IsNumber()
  @IsPositive()
  price: number;
  @IsOptional()
  @IsString()
  id?: string;
}

export class PostOrderDTO {
  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;
  @IsString()
  @Matches(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/, {
    message: 'phone must match format: +7 (XXX) XXX-XX-XX',
  })
  @IsOptional()
  phone: string;
  @ValidateNested({ each: true })
  @Type(() => TicketDTO)
  @ArrayMinSize(1, {
    message: 'tickets array must contain at least one ticket',
  })
  tickets: TicketDTO[];
}
