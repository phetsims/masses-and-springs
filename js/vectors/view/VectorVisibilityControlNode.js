// Copyright 2017-2019, University of Colorado Boulder

/**
 * Panel that manages options visibility for vectors and period trace in Basics version.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  const AquaRadioButton = require( 'SUN/AquaRadioButton' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ForceVectorArrow = require( 'MASSES_AND_SPRINGS/common/view/ForceVectorArrow' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );
  const VectorArrow = require( 'MASSES_AND_SPRINGS/common/view/VectorArrow' );
  const VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );

  // strings
  const accelerationString = require( 'string!MASSES_AND_SPRINGS/acceleration' );
  const forcesString = require( 'string!MASSES_AND_SPRINGS/forces' );
  const gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  const netForceString = require( 'string!MASSES_AND_SPRINGS/netForce' );
  const periodTraceString = require( 'string!MASSES_AND_SPRINGS/periodTrace' );
  const springString = require( 'string!MASSES_AND_SPRINGS/spring' );
  const velocityString = require( 'string!MASSES_AND_SPRINGS/velocity' );

  // constants
  var MAX_WIDTH = 140;
  var DEFAULT_CONTENT_SPACING = 155;

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function VectorVisibilityControlNode( model, tandem, options ) {
    options = _.extend( {
      showForces: true,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'vectorVisibilityControlNode' )
    }, options );

    Node.call( this, options );

    var velocityArrow = new VectorArrow( MassesAndSpringsConstants.VELOCITY_ARROW_COLOR );
    var accelerationArrow = new VectorArrow( MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR );
    var gravityArrow = new ForceVectorArrow( MassesAndSpringsConstants.GRAVITY_ARROW_COLOR );
    var springArrow = new ForceVectorArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR );
    var netForceArrow = new ForceVectorArrow( 'black' );

    // Align group used for label align boxes
    var alignGroup = new AlignGroup( { matchVertical: false } );

    // Members of the attributed to the alignGroup are declared in order as they appear in the sim.
    var velocityAlignBox = new AlignBox( new Text( velocityString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'velocityString' )
    } ), { group: alignGroup, xAlign: 'left' } );

    var accelerationAlignBox = new AlignBox( new Text( accelerationString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'accelerationString' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // Responsible for forces aquaRadioButton
    var forcesVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      model.forcesModeChoice.FORCES,
      new Text( forcesString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH,
        tandem: tandem.createTandem( 'forcesString' )
      } ),
      { radius: 7, spacing: 7 }
    );

    // Indention used for gravity and spring checkbox
    var indentation = 22;

    // Sub group of check boxes indented under forces radio button
    var gravityAlignBox = new AlignBox( new Text( gravityString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH - indentation,
      tandem: tandem.createTandem( 'gravityString' )
    } ), { group: alignGroup, xAlign: 'left' } );
    var springAlignBox = new AlignBox( new Text( springString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH - indentation,
      tandem: tandem.createTandem( 'springString' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // responsible for net force aquaRadioButton
    var netForceAlignBox = new AlignBox( new Text( netForceString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'netForceString' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // Max width must be set to the maxWidth of the alignGroup based on its content.
    var contentSpacing = DEFAULT_CONTENT_SPACING - alignGroup.getMaxWidth();

    var netForceVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      model.forcesModeChoice.NET_FORCES,
      new HBox( { children: [ netForceAlignBox, netForceArrow ], spacing: contentSpacing } ),
      { radius: 7, spacing: 7 }
    );

    // Handle options for checkbox group
    var vectorVisibilityCheckboxGroup;
    var velocityCheckboxObject = {
      node: new HBox( { children: [ velocityAlignBox, velocityArrow ], spacing: contentSpacing } ),
      property: model.velocityVectorVisibilityProperty,
      label: velocityString
    };
    var accelerationCheckboxObject = {
      node: new HBox( { children: [ accelerationAlignBox, accelerationArrow ], spacing: contentSpacing } ),
      property: model.accelerationVectorVisibilityProperty,
      label: accelerationString
    };

    if ( !model.basicsVersion ) {
      vectorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ velocityCheckboxObject, accelerationCheckboxObject ], {
        checkboxOptions: {
          boxWidth: 16,
          spacing: 8
        },
        tandem: tandem.createTandem( 'vectorVisibilityCheckboxGroup' )
      } );
    }

    // Responsible for velocity and acceleration vectors checkboxes and period trace in basics version
    else {
      vectorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
        node: new Text( periodTraceString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: MAX_WIDTH,
          tandem: tandem.createTandem( 'periodTraceString' )
        } ),
        property: model.firstSpring.periodTraceVisibilityProperty
      },
        velocityCheckboxObject,
        accelerationCheckboxObject
      ], {
        checkboxOptions: {
          boxWidth: 16,
          spacing: 8
        },
        tandem: tandem.createTandem( 'vectorVisibilityCheckboxGroup' )
      } );
    }

    // Property that toggles whether the gravity and spring force checkboxes are enabled
    var enabledProperty = new BooleanProperty( model.forcesModeProperty.value === model.forcesModeChoice.FORCES, {
      phetioFeatured: true
    } );

    // Responsible for forces vectors checkboxes
    var forcesVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      node: new HBox( { children: [ gravityAlignBox, gravityArrow ], spacing: contentSpacing - indentation } ),
      property: model.gravityVectorVisibilityProperty,
      label: gravityString
    }, {
      node: new HBox( { children: [ springAlignBox, springArrow ], spacing: contentSpacing - indentation } ),
      property: model.springVectorVisibilityProperty,
      label: springString
    } ], {
      checkboxOptions: {
        enabledProperty: enabledProperty,
        boxWidth: 16
      },
      xMargin: 20,
      tandem: tandem.createTandem( 'forcesVisibilityCheckboxGroup' )
    } );

    // manages the mutability of the forces checkboxes dependent on the forces and net force aquaRadioButton
    model.forcesModeProperty.link( function( mode ) {
      enabledProperty.set( mode === model.forcesModeChoice.FORCES );
    } );

    // Contains all checkboxes and radio buttons for vector visibility
    var vectorVisibilityControlsVBox;

    // groups the checkboxes and forces aquaRadioButton
    if ( options.showForces ) {
      vectorVisibilityControlsVBox = new VBox( {
          children: [
            vectorVisibilityCheckboxGroup,
            forcesVisibilityRadioButton,
            new AlignBox( forcesVisibilityCheckboxGroup, { leftMargin: 22 } ),
            netForceVisibilityRadioButton
          ],
          spacing: 8,
          align: 'left',
          tandem: tandem.createTandem( 'spacingUnit' )
        }
      );
    }
    else {
      vectorVisibilityControlsVBox = new VBox( {
        children: [
          vectorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'spacingUnit' )
      } );
    }
    var controlsHBox = new HBox( {
      spacing: 65,
      children: [
        vectorVisibilityControlsVBox
      ]
    } );
    this.addChild( controlsHBox );
  }

  massesAndSprings.register( 'VectorVisibilityControlNode', VectorVisibilityControlNode );

  return inherit( Node, VectorVisibilityControlNode );
} );