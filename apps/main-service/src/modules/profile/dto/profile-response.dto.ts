import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'The username of the profile',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'The bio of the profile',
    example: 'I am a software engineer',
  })
  bio: string;

  @ApiProperty({
    description: 'The image of the profile',
    example: 'https://example.com',
  })
  image?: string;

  @ApiProperty({
    description: 'Whether the profile is following the current user',
    example: false,
  })
  following: boolean;
}

export class ProfileResponseWrapperDto {
  @ApiProperty({
    description: 'The profile',
    type: ProfileResponseDto,
  })
  profile: ProfileResponseDto;

  constructor(props: User, following: boolean) {
    this.profile = {
      username: props.username,
      bio: props.bio,
      image: props.image,
      following,
    };
  }
}
