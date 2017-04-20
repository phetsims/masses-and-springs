// Copyright 2016-2017, University of Colorado Boulder

/**
 * Node responsible for representing the mass object.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var massValueString = require( 'string!MASSES_AND_SPRINGS/massValue' );

  // constants
  var ARROW_LENGTH = 24;
  var ARROW_SIZE_DEFAULT = 25;
  var ARROW_HEAD_WIDTH = 14;
  var ARROW_TAIL_WIDTH = 8;
  var SMALLER_ARROW_HEAD_WIDTH = 11;
  var SMALLER_ARROW_TAIL_WIDTH = 3;
  var VELOCITY_ARROW_COLOR = 'rgb( 41, 253, 46 )';
  var ACCELERATION_ARROW_COLOR = 'rgb( 255, 253, 56 )';
  var GRAVITY_ARROW_COLOR = 'rgb( 236, 63, 71 )';
  var SPRING_ARROW_COLOR = 'rgb( 36, 36, 255 )';


  /**
   * @param {Mass} mass -  model object
   * @param {ModelViewTransform2} modelViewTransform2
   * @param {MassesAndSpringsScreenView} screenView
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function MassNode( mass, modelViewTransform2, screenView, model, tandem ) {
    Node.call( this, { cursor: 'pointer' } );
    var self = this;

    this.mass = mass;

    var viewBounds = new Bounds2(
      modelViewTransform2.modelToViewDeltaX( -mass.radius ),
      0,
      modelViewTransform2.modelToViewDeltaX( mass.radius ),
      modelViewTransform2.modelToViewDeltaY( -mass.height )
    );
    var rect = Rectangle.bounds( viewBounds, {
      stroke: 'black',
      lineWidth: .5,
      fill: new LinearGradient( viewBounds.minX, 0, viewBounds.maxX, 0 )
        .addColorStop( 0.1, mass.color )
        .addColorStop( 0.2, 'rgb(205,206,207)' )
        .addColorStop( .7, mass.color )
    } );
    this.addChild( rect );
    if ( mass.isLabeled ) {
      var label = new Text( StringUtils.format( massValueString, mass.mass * 1000 ), {
        font: MassesAndSpringsConstants.TITLE_FONT,
        fill: 'black',
        centerY: viewBounds.centerY,
        centerX: 0,
        pickable: false,
        maxWidth: 50,
        tandem: tandem.createTandem( 'label' )
      } );

      var labelBackground = Rectangle.bounds( label.bounds, { fill: '#D3D3D3' } );
      this.addChild( labelBackground );
      this.addChild( label );
    }

    this.mass.positionProperty.link( function( position ) {
      self.translation = modelViewTransform2.modelToViewPosition( position );
    } );

    var modelOffset;

    this.addInputListener( new TandemSimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,
      tandem: tandem.createTandem( 'dragHandler' ),

      // Handler that moves the particle in model space.
      drag: function( event ) {
        var proposedMassPosition = modelViewTransform2
          .viewToModelPosition( screenView.globalToLocalPoint( event.pointer.point ) )
          .minus( modelOffset );
        model.adjustDraggedMassPosition( self.mass, proposedMassPosition );
      },

      start: function( event ) {
        modelOffset = modelViewTransform2
          .viewToModelPosition( screenView.globalToLocalPoint( event.pointer.point ) )
          .minus( self.mass.positionProperty.get() );
        mass.userControlledProperty.set( true );
        self.moveToFront();
      },

      end: function() {
        mass.userControlledProperty.set( false );
      }
    } ) );

    var forceNullLine = new Line( 0, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 1,
      cursor: 'pointer'
    } );

    //Arrows created for vectors associated with mass nodes
    this.velocityArrow = model.createArrow( 10, 10 + ARROW_LENGTH, VELOCITY_ARROW_COLOR, 'black', ARROW_TAIL_WIDTH, ARROW_HEAD_WIDTH, 'velocityArrow' );
    this.accelerationArrow = model.createArrow( 10, 10 + ARROW_LENGTH, ACCELERATION_ARROW_COLOR, 'black', ARROW_TAIL_WIDTH, ARROW_HEAD_WIDTH, 'accelerationArrow' );
    this.gravityForceArrow = model.createArrow( 5, 7 + ARROW_LENGTH, GRAVITY_ARROW_COLOR, GRAVITY_ARROW_COLOR, SMALLER_ARROW_TAIL_WIDTH, SMALLER_ARROW_HEAD_WIDTH, 'gravityForceArrow' );
    this.springForceArrow = model.createArrow( 5, 7 + ARROW_LENGTH, SPRING_ARROW_COLOR, SPRING_ARROW_COLOR, SMALLER_ARROW_TAIL_WIDTH, SMALLER_ARROW_HEAD_WIDTH, 'springForceArrow' );
    this.netForceArrow = model.createArrow( 5, 7 + ARROW_LENGTH, 'black', 'black', SMALLER_ARROW_TAIL_WIDTH, SMALLER_ARROW_HEAD_WIDTH, 'netForceArrow' );

    this.addChild( this.velocityArrow );
    this.addChild( this.accelerationArrow );
    this.addChild( this.gravityForceArrow );
    this.addChild( this.springForceArrow );
    this.addChild( this.netForceArrow );
    this.addChild( forceNullLine );


    //TODO: We are keeping these properties in the common model because they are referenced in the lab screen, but this link is being referenced in the intro screen where it isn't needed.
    // Links handling the visibility of vectors
    Property.multilink( [ mass.springProperty, model.velocityVectorVisibilityProperty, mass.userControlledProperty ], function( springMassAttachedTo, visible, userControlled ) {
      if ( springMassAttachedTo !== null && visible === true && userControlled === false ) {self.velocityArrow.visible = visible;}
      else if ( springMassAttachedTo === null || visible === false || userControlled === true ) {self.velocityArrow.visible = false;}
    } );

    Property.multilink( [ mass.springProperty, model.accelerationVectorVisibilityProperty, mass.userControlledProperty ], function( springMassAttachedTo, visible, userControlled ) {
      if ( springMassAttachedTo !== null && visible === true && userControlled === false ) {self.accelerationArrow.visible = visible;}
      else if ( springMassAttachedTo === null || visible === false || userControlled === true ) {self.accelerationArrow.visible = false;}
    } );

    Property.multilink( [ mass.springProperty, model.gravityVectorVisibilityProperty, model.forcesModeProperty ], function( springMassAttachedTo, visible, forcesVisible ) {
      if ( springMassAttachedTo !== null && visible === true && forcesVisible === 'forces' ) {self.gravityForceArrow.visible = visible;}
      else if ( springMassAttachedTo === null || visible === false || forcesVisible === 'netForce' ) {self.gravityForceArrow.visible = false;}
    } );

    Property.multilink( [ mass.springProperty, model.springVectorVisibilityProperty, model.forcesModeProperty ], function( springMassAttachedTo, visible, forcesVisible ) {
      if ( springMassAttachedTo !== null && visible === true && forcesVisible === 'forces' ) {self.springForceArrow.visible = visible;}
      else if ( springMassAttachedTo === null || visible === false || forcesVisible === 'netForce' ) {self.springForceArrow.visible = false;}
    } );

    Property.multilink( [ mass.springProperty, model.netForceVectorVisibilityProperty, model.forcesModeProperty ], function( springMassAttachedTo, visible, forcesVisible ) {
      if ( springMassAttachedTo !== null && forcesVisible === 'netForce' ) {self.netForceArrow.visible = true;}
      else if ( springMassAttachedTo === null || visible === false || forcesVisible === 'forces' ) {self.netForceArrow.visible = false;}
    } );

    Property.multilink( [ mass.springProperty, model.gravityVectorVisibilityProperty, model.springVectorVisibilityProperty, model.forcesModeProperty ],
      function( springMassAttachedTo, gravityForceVisible, springForceVisible, forcesVisible ) {
        if ( springMassAttachedTo !== null && ( gravityForceVisible || springForceVisible || (forcesVisible === 'netForce') ) ) {forceNullLine.visible = true;}
        else {forceNullLine.visible = false;}
      } );


    //TODO: Create MASArrowNode with arguements for deltas in X&Y, mass position, and the property it is depicting
    //TODO: Considering moving in visibility multilinks)
    //Links for handling the length of the vectors in response to the system.
    var scalingFactor = 3;
    mass.verticalVelocityProperty.link( function( velocity ) {
        var position = ( mass.positionProperty.get() );
      self.velocityArrow.setTailAndTip(
        position.x - 10,
          position.y + 10,
          position.x - 10,
          position.y + 10 - ARROW_SIZE_DEFAULT * velocity * scalingFactor
        );
      }
    );

    // When gravity changes, update the gravitational force arrow
    Property.multilink( [ mass.gravityProperty, mass.positionProperty ], function( gravity, position ) {
      var gravitationalAcceleration = mass.mass * gravity;
      self.gravityForceArrow.setTailAndTip(
        position.x + 45,
        position.y + 40,
        position.x + 45,
        position.y + 40 + ARROW_SIZE_DEFAULT * gravitationalAcceleration
      );
    } );

    // When the spring force changes, update the arrow
    Property.multilink( [ mass.springForceProperty, mass.positionProperty ], function( springForce, position ) {
      if ( Math.abs( springForce ) < 1E-6 ) {
        self.springForceArrow.setTailAndTip(
          position.x + 45,
          position.y + 40,
          position.x + 45,
          position.y + 40 - ARROW_SIZE_DEFAULT * springForce
        );
      }
    } );

    assert && assert( mass.springProperty.get() === null, 'We currently assume that the masses don\'t start attached to the springs' );

    Property.multilink( [ mass.netForceProperty, mass.positionProperty ], function( netForce, position ) {
      if ( Math.abs( netForce ) > 1E-6 ) {
        self.netForceArrow.setTailAndTip(
          position.x + 45,
          position.y + 40,
          position.x + 45,
          position.y + 40 - ARROW_SIZE_DEFAULT * netForce
        );
      }
      var netAcceleration = netForce / mass.mass;
      if ( Math.abs( netAcceleration ) > 1E-6 ) {
        self.accelerationArrow.setTailAndTip(
          position.x + 10,
          position.y + 10,
          position.x + 10,
          position.y + 10 - ARROW_SIZE_DEFAULT * netAcceleration / scalingFactor
        );
      }
    } );

    mass.positionProperty.link( function( position ) {
      forceNullLine.setLine( position.x + 40, position.y + 40, position.x + 50, position.y + 40 );
    } );
  }

  massesAndSprings.register( 'MassNode', MassNode );
  return inherit( Node, MassNode );
} );