import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user with default role (USER)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully updated.',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  updateUser(
    @Param('id') id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @GetUser() currentUser: User,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto, currentUser);
  }

  @Patch(':id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LIBRARIAN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Disable a user (Admin and Librarian only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully disabled.',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
  @ApiForbiddenResponse({ description: 'Forbidden resource.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  disableUser(
    @Param('id') id: number,
    @GetUser() currentUser: User,
  ): Promise<User> {
    return this.usersService.disableUser(id, currentUser);
  }
}
